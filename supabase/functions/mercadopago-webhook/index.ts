import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature, x-request-id',
};

const MP_API = 'https://api.mercadopago.com';

// Verifica assinatura HMAC-SHA256 do Mercado Pago.
// MP assina: "ts={ts};v1={body}" com o webhook secret.
// Header x-signature vem no formato: "ts=...,v1=..."
async function verifyMpSignature(
  rawBody: string,
  xSignature: string,
  xRequestId: string,
  secret: string,
): Promise<boolean> {
  try {
    // Extrair ts e v1 do header x-signature
    const parts = Object.fromEntries(
      xSignature.split(',').map(p => p.split('=') as [string, string]),
    );
    const ts = parts['ts'];
    const v1 = parts['v1'];
    if (!ts || !v1) return false;

    // Template de assinatura conforme documentação MP
    const manifest = `id:${xRequestId};request-id:${xRequestId};ts:${ts};`;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(manifest));
    const computed = Array.from(new Uint8Array(sig))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (computed.length !== v1.length) return false;
    let diff = 0;
    for (let i = 0; i < computed.length; i++) {
      diff |= computed.charCodeAt(i) ^ v1.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    const rawBody = await req.text();
    console.log('[webhook] Payload recebido:', rawBody.slice(0, 500));

    // Verificar assinatura MP (opcional mas recomendado em produção)
    const webhookSecret = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET');
    if (webhookSecret) {
      const xSignature  = req.headers.get('x-signature') ?? '';
      const xRequestId  = req.headers.get('x-request-id') ?? '';
      const valid = await verifyMpSignature(rawBody, xSignature, xRequestId, webhookSecret);
      if (!valid) {
        console.warn('[webhook] Assinatura inválida — rejeitando.');
        return new Response('unauthorized', { status: 401, headers: corsHeaders });
      }
    }

    // O MP envia notificações no formato:
    // { "action": "payment.updated", "data": { "id": "12345678" } }
    // ou IPN legacy: query params ?topic=payment&id=12345678
    const url    = new URL(req.url);
    const topic  = url.searchParams.get('topic');
    const idQs   = url.searchParams.get('id');

    let paymentId: string | null = null;

    if (rawBody && rawBody.trim().startsWith('{')) {
      const body = JSON.parse(rawBody);
      const action: string = body.action ?? '';
      console.log('[webhook] Action:', action);

      // Aceitar payment.created e payment.updated
      if (!action.startsWith('payment.')) {
        console.log('[webhook] Action ignorada:', action);
        return new Response('ok', { status: 200, headers: corsHeaders });
      }

      paymentId = String(body.data?.id ?? '');
    } else if (topic === 'payment' && idQs) {
      // Notificação IPN legacy
      paymentId = idQs;
    }

    if (!paymentId) {
      console.warn('[webhook] Sem payment ID no payload.');
      return new Response('ok', { status: 200, headers: corsHeaders });
    }

    // Buscar detalhes do pagamento na API do MP para confirmar status
    const mpToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!mpToken) throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado.');

    const mpRes = await fetch(`${MP_API}/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${mpToken}` },
    });

    if (!mpRes.ok) {
      console.error('[webhook] Erro ao consultar pagamento MP:', mpRes.status, await mpRes.text());
      return new Response('ok', { status: 200, headers: corsHeaders });
    }

    const payment = await mpRes.json();
    console.log('[webhook] Status do pagamento:', payment.status, '| ID:', paymentId);

    if (payment.status !== 'approved') {
      console.log('[webhook] Pagamento não aprovado, ignorando.');
      return new Response('ok', { status: 200, headers: corsHeaders });
    }

    // Buscar invoice pelo payment ID (salvo em abacate_payment_id por compatibilidade)
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('abacate_payment_id', paymentId)
      .single();

    if (invoiceError || !invoice) {
      console.error('[webhook] Invoice não encontrada para ID:', paymentId);
      return new Response('ok', { status: 200, headers: corsHeaders });
    }

    // Idempotência
    if (invoice.status === 'paid') {
      console.log('[webhook] Invoice já paga, ignorando duplicata.');
      return new Response('ok', { status: 200, headers: corsHeaders });
    }

    const now = new Date();
    const accessExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 dias

    // Marcar invoice como paga
    const { error: updateInvoiceError } = await supabase
      .from('invoices')
      .update({ status: 'paid', paid_at: now.toISOString() })
      .eq('id', invoice.id);

    if (updateInvoiceError) {
      console.error('[webhook] Erro ao atualizar invoice:', updateInvoiceError);
      return new Response('error', { status: 500, headers: corsHeaders });
    }

    // Liberar acesso por 30 dias
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        access_expires_at:   accessExpiresAt.toISOString(),
      })
      .eq('user_id', invoice.user_id);

    if (updateProfileError) {
      console.error('[webhook] Erro ao atualizar profile:', updateProfileError);
      return new Response('error', { status: 500, headers: corsHeaders });
    }

    console.log(`[webhook] ✅ Acesso liberado para user ${invoice.user_id} até ${accessExpiresAt.toISOString()}`);
    return new Response('ok', { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error('[webhook] Erro inesperado:', err);
    return new Response('ok', { status: 200, headers: corsHeaders });
  }
});

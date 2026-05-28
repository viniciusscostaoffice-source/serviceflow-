// Renomeado logicamente para abacatepay-webhook — mantemos o path por compatibilidade com deploy existente.
// Para novo deploy, use: supabase functions deploy abacatepay-webhook
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { encodeBase64 } from 'https://deno.land/std@0.224.0/encoding/base64.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
};

async function verifySignature(rawBody: string, signatureHeader: string, publicKey: string): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(publicKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
    const expected = encodeBase64(new Uint8Array(sig));
    // Comparação segura contra timing attacks
    if (expected.length !== signatureHeader.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ signatureHeader.charCodeAt(i);
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

    // Verificar assinatura HMAC (opcional mas recomendado em produção)
    const abacatePublicKey = Deno.env.get('ABACATEPAY_WEBHOOK_PUBLIC_KEY');
    if (abacatePublicKey) {
      const signature = req.headers.get('x-webhook-signature') ?? '';
      const valid = await verifySignature(rawBody, signature, abacatePublicKey);
      if (!valid) {
        console.warn('[webhook] Assinatura inválida — rejeitando.');
        return new Response('unauthorized', { status: 401, headers: corsHeaders });
      }
    }

    const body = JSON.parse(rawBody);

    // Abacatepay usa evento "checkout.completed" para pagamento confirmado
    // Para transparentes Pix, o evento pode ser "transparent.completed" — aceitar ambos
    const event: string = body.event ?? '';
    console.log('[webhook] Evento:', event);

    if (!['checkout.completed', 'transparent.completed', 'billing.paid', 'payment.paid', 'billing.completed'].includes(event)) {
      console.log('[webhook] Evento ignorado:', event);
      return new Response('ok', { status: 200, headers: corsHeaders });
    }

    // O ID do pagamento vem em data.id
    const abacatePaymentId: string = String(body.data?.id ?? '');
    if (!abacatePaymentId) {
      console.warn('[webhook] Sem payment id no payload.');
      return new Response('ok', { status: 200, headers: corsHeaders });
    }

    // Buscar invoice pelo abacate payment id (salvo em abacate_payment_id por compatibilidade)
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('abacate_payment_id', abacatePaymentId)
      .single();

    if (invoiceError || !invoice) {
      console.error('[webhook] Invoice não encontrada para ID:', abacatePaymentId);
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

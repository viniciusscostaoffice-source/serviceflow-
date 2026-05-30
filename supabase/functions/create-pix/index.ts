import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MP_API = 'https://api.mercadopago.com';

const PLAN_PRICES: Record<string, number> = {
  basico:       59.00,
  profissional: 80.00,
  premium:      120.00,
};

const PLAN_LABELS: Record<string, string> = {
  basico:       'Plano Básico — ServiceFlow',
  profissional: 'Plano Profissional — ServiceFlow',
  premium:      'Plano Premium — ServiceFlow',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const body = await req.json();
    const userId: string = body.user_id ?? 'demo-user-001';
    const planName: string = body.plan ?? 'basico';
    const unitPrice = PLAN_PRICES[planName] ?? 59.00;
    const amountCents = Math.round(unitPrice * 100);
    const label = PLAN_LABELS[planName] ?? PLAN_LABELS.basico;

    // 1. Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Reutilizar cobrança pendente válida se existir
    const { data: existingInvoice } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingInvoice?.pix_qr_code_base64) {
      return new Response(
        JSON.stringify({
          pix_qr_code_base64: existingInvoice.pix_qr_code_base64,
          pix_copy_paste:     existingInvoice.pix_copy_paste,
          ticket_url:         existingInvoice.ticket_url,
          expires_at:         existingInvoice.expires_at,
          invoice_id:         existingInvoice.id,
          reused:             true,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // 3. Buscar dados do usuário via auth admin
    let customerName = 'Cliente ServiceFlow';
    let customerEmail = profile.email ?? 'cliente@serviceflow.com.br';
    let customerCpf = (profile.tax_id ?? '').replace(/\D/g, '') || '00000000000';
    try {
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      if (authUser?.user?.user_metadata?.nome) {
        customerName = authUser.user.user_metadata.nome;
      }
      if (authUser?.user?.email) {
        customerEmail = authUser.user.email;
      }
    } catch (_) { /* fallback */ }

    // 4. Criar Pix via Mercado Pago Payments API
    const mpToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!mpToken) throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado.');

    // Expira em 1 hora
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    // Formato ISO 8601 com offset BR (MP exige timezone explícita)
    const expiresAtISO = expiresAt.toISOString().replace('Z', '-03:00');

    const [firstName, ...rest] = customerName.trim().split(' ');
    const lastName = rest.join(' ') || firstName;

    const pixPayload = {
      transaction_amount: unitPrice,
      payment_method_id:  'pix',
      installments:       1,
      description:        label,
      payer: {
        email:      customerEmail,
        first_name: firstName,
        last_name:  lastName,
        identification: {
          type:   'CPF',
          number: customerCpf,
        },
      },
      metadata:            { user_id: userId, plan: planName },
      date_of_expiration:  expiresAtISO,
    };

    console.log('[create-pix] Enviando para Mercado Pago:', JSON.stringify(pixPayload));

    const mpResponse = await fetch(`${MP_API}/v1/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mpToken}`,
        'Content-Type':  'application/json',
        // Header de idempotência para evitar duplicatas em retries
        'X-Idempotency-Key': `${userId}-${planName}-${Date.now()}`,
      },
      body: JSON.stringify(pixPayload),
    });

    const responseText = await mpResponse.text();
    console.log('[create-pix] MP status:', mpResponse.status, '| body:', responseText.slice(0, 400));

    if (!mpResponse.ok) {
      return new Response(JSON.stringify({ error: `MercadoPago ${mpResponse.status}: ${responseText}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const mpData = JSON.parse(responseText);
    const txData = mpData.point_of_interaction?.transaction_data;

    if (!txData?.qr_code) {
      return new Response(JSON.stringify({ error: 'MercadoPago: dados Pix não retornados.' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const pixCopyPaste   = txData.qr_code as string;
    const pixQrBase64    = txData.qr_code_base64 as string | null ?? null;
    const paymentExpires = mpData.date_of_expiration as string | null ?? expiresAt.toISOString();

    // 5. Salvar invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id:            userId,
        amount:             amountCents,
        plan_name:          planName,
        status:             'pending',
        abacate_payment_id: String(mpData.id), // payment ID do MP
        pix_qr_code_base64: pixQrBase64,
        pix_copy_paste:     pixCopyPaste,
        ticket_url:         null,
        expires_at:         paymentExpires,
      })
      .select()
      .single();

    if (invoiceError) {
      console.error('[create-pix] Erro ao salvar invoice:', invoiceError);
      throw invoiceError;
    }

    // 6. Atualizar status do usuário
    await supabase
      .from('profiles')
      .update({ subscription_status: 'payment_pending' })
      .eq('user_id', userId);

    console.log(`[create-pix] ✅ Pix criado: ${mpData.id} | expira: ${paymentExpires}`);

    return new Response(
      JSON.stringify({
        pix_qr_code_base64: pixQrBase64,
        pix_copy_paste:     pixCopyPaste,
        ticket_url:         null,
        expires_at:         paymentExpires,
        invoice_id:         invoice.id,
        reused:             false,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[create-pix] Erro inesperado:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

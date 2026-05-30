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
    const userId: string       = body.user_id;
    const planName: string     = body.plan ?? 'basico';
    const cardToken: string    = body.card_token;       // token gerado pelo Brick
    const installments: number = body.installments ?? 1;
    const paymentMethodId: string = body.payment_method_id; // ex: "visa", "master"
    const issuerId: string | undefined = body.issuer_id;

    if (!userId || !cardToken || !paymentMethodId) {
      return new Response(JSON.stringify({ error: 'Parâmetros obrigatórios ausentes.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const unitPrice  = PLAN_PRICES[planName] ?? 59.00;
    const amountCents = Math.round(unitPrice * 100);
    const label      = PLAN_LABELS[planName] ?? PLAN_LABELS.basico;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let customerName  = 'Cliente ServiceFlow';
    let customerEmail = profile.email ?? 'cliente@serviceflow.com.br';
    let customerCpf   = (profile.tax_id ?? '').replace(/\D/g, '') || '00000000000';
    try {
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      if (authUser?.user?.user_metadata?.nome) customerName = authUser.user.user_metadata.nome;
      if (authUser?.user?.email) customerEmail = authUser.user.email;
    } catch (_) { /* fallback */ }

    const mpToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
    if (!mpToken) throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado.');

    const [firstName, ...rest] = customerName.trim().split(' ');
    const lastName = rest.join(' ') || firstName;

    const paymentPayload: Record<string, unknown> = {
      transaction_amount: unitPrice,
      token:              cardToken,
      description:        label,
      installments,
      payment_method_id:  paymentMethodId,
      payer: {
        email:      customerEmail,
        first_name: firstName,
        last_name:  lastName,
        identification: {
          type:   'CPF',
          number: customerCpf,
        },
      },
      metadata: { user_id: userId, plan: planName },
    };

    if (issuerId) paymentPayload.issuer_id = issuerId;

    console.log('[create-card] Enviando para Mercado Pago:', JSON.stringify(paymentPayload));

    const mpResponse = await fetch(`${MP_API}/v1/payments`, {
      method: 'POST',
      headers: {
        'Authorization':     `Bearer ${mpToken}`,
        'Content-Type':      'application/json',
        'X-Idempotency-Key': `card-${userId}-${planName}-${Date.now()}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const responseText = await mpResponse.text();
    console.log('[create-card] MP status:', mpResponse.status, '| body:', responseText.slice(0, 400));

    if (!mpResponse.ok) {
      return new Response(JSON.stringify({ error: `MercadoPago ${mpResponse.status}: ${responseText}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const mpData = JSON.parse(responseText);
    const status: string = mpData.status; // approved | in_process | rejected

    await supabase.from('invoices').insert({
      user_id:            userId,
      amount:             amountCents,
      plan_name:          planName,
      status:             status === 'approved' ? 'paid' : 'pending',
      abacate_payment_id: String(mpData.id),
      ticket_url:         null,
      expires_at:         null,
      paid_at:            status === 'approved' ? new Date().toISOString() : null,
    });

    if (status === 'approved') {
      const accessExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await supabase
        .from('profiles')
        .update({ subscription_status: 'active', access_expires_at: accessExpiresAt.toISOString() })
        .eq('user_id', userId);
    } else {
      await supabase
        .from('profiles')
        .update({ subscription_status: 'payment_pending' })
        .eq('user_id', userId);
    }

    console.log(`[create-card] ✅ Pagamento ${mpData.id} | status: ${status}`);

    return new Response(
      JSON.stringify({ payment_status: status, payment_id: mpData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[create-card] Erro inesperado:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

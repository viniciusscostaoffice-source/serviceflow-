import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ABACATE_API = 'https://api.abacatepay.com/v2';

const PRODUCT_IDS: Record<string, string> = {
  basico:       'prod_UPqjur4y1GE6jUbp4EJPrF1M',
  profissional: 'prod_LDrpyjZ3c5gA61CRmWLuBusR',
  premium:      'prod_JDj0utqUSN6ck1s2wnHE02eH',
};

const PLAN_PRICES: Record<string, number> = {
  basico:       5900,
  profissional: 8000,
  premium:      12000,
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
    const amount = PLAN_PRICES[planName] ?? 5900;
    const productId = PRODUCT_IDS[planName] ?? PRODUCT_IDS.basico;

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

    let customerName = 'Cliente ServiceFlow';
    try {
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      if (authUser?.user?.user_metadata?.nome) {
        customerName = authUser.user.user_metadata.nome;
      }
    } catch (_) { /* fallback */ }

    const abacateToken = Deno.env.get('ABACATEPAY_API_KEY');
    if (!abacateToken) throw new Error('ABACATEPAY_API_KEY não configurado.');

    const appUrl = Deno.env.get('APP_URL') ?? 'https://app.serviceflow.com.br';

    const checkoutPayload = {
      methods: ['CARD'],
      items: [{ id: productId, quantity: 1 }],
      returnUrl:     `${appUrl}/dashboard?payment=success`,
      completionUrl: `${appUrl}/dashboard?payment=success`,
      customer: {
        name:      customerName,
        email:     profile.email ?? 'cliente@serviceflow.com.br',
        cellphone: profile.cellphone ?? '11999999999',
        taxId:     profile.tax_id ?? '11144477735',
      },
      metadata: { user_id: userId, plan: planName },
    };

    console.log('[create-card] Enviando para Abacatepay:', JSON.stringify(checkoutPayload));

    const abacateResponse = await fetch(`${ABACATE_API}/checkouts/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abacateToken}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(checkoutPayload),
    });

    const responseText = await abacateResponse.text();
    console.log('[create-card] Abacatepay status:', abacateResponse.status, '| body:', responseText);

    if (!abacateResponse.ok) {
      return new Response(JSON.stringify({ error: `Abacatepay ${abacateResponse.status}: ${responseText}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const abacateData = JSON.parse(responseText);

    if (!abacateData.success || !abacateData.data) {
      return new Response(JSON.stringify({ error: `Abacatepay: ${abacateData.error ?? 'resposta inválida'}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const checkout = abacateData.data;

    await supabase.from('invoices').insert({
      user_id:            userId,
      amount,
      plan_name:          planName,
      status:             'pending',
      abacate_payment_id: checkout.id,
      ticket_url:         checkout.url,
      expires_at:         null,
    });

    await supabase
      .from('profiles')
      .update({ subscription_status: 'payment_pending' })
      .eq('user_id', userId);

    console.log(`[create-card] ✅ Checkout cartão criado: ${checkout.id} | URL: ${checkout.url}`);

    return new Response(
      JSON.stringify({ checkout_url: checkout.url }),
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

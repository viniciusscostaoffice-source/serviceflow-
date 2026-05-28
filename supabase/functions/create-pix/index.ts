import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ABACATE_API = 'https://api.abacatepay.com/v2';

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

    // 3. Buscar nome do usuário via auth admin
    let customerName = 'Cliente ServiceFlow';
    try {
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      if (authUser?.user?.user_metadata?.nome) {
        customerName = authUser.user.user_metadata.nome;
      }
    } catch (_) { /* fallback */ }

    // 4. Criar Pix transparente no Abacatepay v2
    const abacateToken = Deno.env.get('ABACATEPAY_API_KEY');
    if (!abacateToken) throw new Error('ABACATEPAY_API_KEY não configurado.');

    const pixPayload = {
      method: 'PIX',
      data: {
        amount,
        expiresIn: 3600, // 1 hora em segundos
        customer: {
          name:      customerName,
          email:     profile.email ?? 'cliente@serviceflow.com.br',
          cellphone: profile.cellphone ?? '11999999999',
          taxId:     profile.tax_id ?? '11144477735',
        },
      },
    };

    console.log('[create-pix] Enviando para Abacatepay transparents:', JSON.stringify(pixPayload));

    const abacateResponse = await fetch(`${ABACATE_API}/transparents/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abacateToken}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify(pixPayload),
    });

    const responseText = await abacateResponse.text();
    console.log('[create-pix] Abacatepay status:', abacateResponse.status, '| body:', responseText.slice(0, 300));

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

    const pix = abacateData.data;

    // brCodeBase64 vem com prefixo "data:image/png;base64," — extrair só o base64
    const qrBase64 = pix.brCodeBase64?.replace(/^data:image\/[^;]+;base64,/, '') ?? null;

    // 5. Salvar invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id:            userId,
        amount,
        plan_name:          planName,
        status:             'pending',
        abacate_payment_id: pix.id,
        pix_qr_code_base64: qrBase64,
        pix_copy_paste:     pix.brCode ?? null,
        ticket_url:         null,
        expires_at:         pix.expiresAt ?? null,
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

    console.log(`[create-pix] ✅ Pix criado: ${pix.id} | expira: ${pix.expiresAt}`);

    return new Response(
      JSON.stringify({
        pix_qr_code_base64: qrBase64,
        pix_copy_paste:     pix.brCode ?? null,
        ticket_url:         null,
        expires_at:         pix.expiresAt ?? null,
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

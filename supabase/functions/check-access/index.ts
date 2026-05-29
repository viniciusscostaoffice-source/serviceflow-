import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export type AccessStatus = 'trial' | 'active' | 'payment_pending' | 'blocked';

const LIMITE_POR_PLANO: Record<string, number> = {
  basico:       3,
  profissional: 10,
  premium:      999,
};

export interface AccessResponse {
  allowed: boolean;
  status: AccessStatus;
  trial_ends_at: string | null;
  access_expires_at: string | null;
  days_remaining: number | null;
  warning: boolean;
  plan: string;
  mecanicos_limit: number;
}

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

    // Buscar ou criar profile
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Auto-criar profile se não existir (primeiro acesso)
    if (!profile) {
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({
          user_id:       userId,
          trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          subscription_status: 'trial',
        })
        .select()
        .single();
      profile = newProfile;
    }

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Erro ao buscar perfil.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const now = new Date();

    // -- Calcular status real (banco pode estar desatualizado) --

    // Trial ativo?
    const trialEnd = profile.trial_ends_at ? new Date(profile.trial_ends_at) : null;
    const inTrial = trialEnd !== null && now < trialEnd;

    // Acesso pago ativo?
    const accessEnd = profile.access_expires_at ? new Date(profile.access_expires_at) : null;
    const hasActiveAccess = accessEnd !== null && now < accessEnd;

    let status: AccessStatus;
    let allowed: boolean;
    let daysRemaining: number | null = null;

    if (inTrial) {
      status = 'trial';
      allowed = true;
      daysRemaining = Math.ceil((trialEnd!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    } else if (hasActiveAccess) {
      status = 'active';
      allowed = true;
      daysRemaining = Math.ceil((accessEnd!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    } else {
      // Sem trial e sem acesso pago — bloquear
      allowed = false;
      status = 'blocked';
      daysRemaining = null;

      // Sincronizar banco se necessário
      if (profile.subscription_status !== 'blocked' && profile.subscription_status !== 'payment_pending') {
        await supabase
          .from('profiles')
          .update({ subscription_status: 'blocked' })
          .eq('user_id', userId);
      }
    }

    const warning = allowed && daysRemaining !== null && daysRemaining <= 3;

    // Buscar plano da invoice mais recente paga
    const { data: invoice } = await supabase
      .from('invoices')
      .select('plan_name')
      .eq('user_id', userId)
      .eq('status', 'paid')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const plan = invoice?.plan_name ?? 'basico';
    const mecanicosLimit = LIMITE_POR_PLANO[plan] ?? 3;

    const response: AccessResponse = {
      allowed,
      status,
      trial_ends_at:     profile.trial_ends_at,
      access_expires_at: profile.access_expires_at,
      days_remaining:    daysRemaining,
      warning,
      plan,
      mecanicos_limit:   mecanicosLimit,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[check-access] Erro:', err);
    return new Response(JSON.stringify({ error: 'Erro interno.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

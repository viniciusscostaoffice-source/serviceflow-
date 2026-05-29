import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';

export type AccessStatus = 'trial' | 'active' | 'payment_pending' | 'blocked' | 'loading';

export interface BillingState {
  status: AccessStatus;
  allowed: boolean;
  daysRemaining: number | null;
  warning: boolean;
  trialEndsAt: string | null;
  accessExpiresAt: string | null;
  plan: string;
  mecanicosLimit: number;
}

export interface PixData {
  pixQrCodeBase64: string | null;
  pixCopyPaste: string | null;
  ticketUrl: string | null;
  expiresAt: string | null;
  invoiceId: string | null;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

async function getUserId(): Promise<string> {
  // Tenta do localStorage primeiro (mais rápido)
  const cached = localStorage.getItem('sf_user_id');
  if (cached) return cached;
  // Fallback: busca direto da sessão do Supabase
  const { data } = await supabase.auth.getSession();
  const id = data.session?.user?.id ?? '';
  if (id) localStorage.setItem('sf_user_id', id);
  return id;
}

export function useBilling() {
  const [billing, setBilling] = useState<BillingState>({
    status: 'loading',
    allowed: true,
    daysRemaining: null,
    warning: false,
    trialEndsAt: null,
    accessExpiresAt: null,
    plan: 'basico',
    mecanicosLimit: 3,
  });
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [pixLoading, setPixLoading] = useState(false);
  const [pixError, setPixError] = useState<string | null>(null);

  const checkAccess = useCallback(async () => {
    const userId = await getUserId();
    if (!userId) {
      setBilling(prev => ({ ...prev, status: 'trial', allowed: true }));
      return;
    }
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/check-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY as string,
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!res.ok) throw new Error('Erro ao verificar acesso.');

      const data = await res.json();

      setBilling({
        status:          data.status ?? 'blocked',
        allowed:         data.allowed ?? false,
        daysRemaining:   data.days_remaining ?? null,
        warning:         data.warning ?? false,
        trialEndsAt:     data.trial_ends_at ?? null,
        accessExpiresAt: data.access_expires_at ?? null,
        plan:            data.plan ?? 'basico',
        mecanicosLimit:  data.mecanicos_limit ?? 3,
      });
    } catch (err) {
      console.error('[useBilling] checkAccess:', err);
      // Em caso de erro de rede, libera acesso para não bloquear o usuário indevidamente
      setBilling(prev => ({ ...prev, status: 'trial', allowed: true }));
    }
  }, []);

  const createCard = useCallback(async (plan = 'basico') => {
    setPixLoading(true);
    setPixError(null);
    try {
      const userId = await getUserId();
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY as string,
        },
        body: JSON.stringify({ user_id: userId, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erro ao criar cobrança.');
      // Redirecionar para a página de pagamento do Abacatepay
      if (data.checkout_url) window.open(data.checkout_url, '_blank');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao gerar pagamento.';
      setPixError(msg);
    } finally {
      setPixLoading(false);
    }
  }, []);

  const createPix = useCallback(async (plan = 'basico') => {
    setPixLoading(true);
    setPixError(null);
    setPixData(null);

    try {
      const userId = await getUserId();
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-pix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY as string,
        },
        body: JSON.stringify({ user_id: userId, plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Erro ao gerar Pix.');
      }

      setPixData({
        pixQrCodeBase64: data.pix_qr_code_base64 ?? null,
        pixCopyPaste:    data.pix_copy_paste ?? null,
        ticketUrl:       data.ticket_url ?? null,
        expiresAt:       data.expires_at ?? null,
        invoiceId:       data.invoice_id ?? null,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao gerar Pix.';
      setPixError(msg);
    } finally {
      setPixLoading(false);
    }
  }, []);

  // Verificar pagamento manualmente (botão "Já paguei")
  const verifyPayment = useCallback(async () => {
    await checkAccess();
  }, [checkAccess]);

  useEffect(() => {
    checkAccess();
    // Re-verificar a cada 30 segundos (trial ou pagamento pendente)
    const interval = setInterval(() => {
      if (billing.status === 'trial' || billing.status === 'payment_pending') checkAccess();
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, [checkAccess, billing.status]);

  return {
    billing,
    pixData,
    pixLoading,
    pixError,
    createPix,
    createCard,
    verifyPayment,
    clearPix: () => setPixData(null),
  };
}

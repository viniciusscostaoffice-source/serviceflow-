import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import type { BillingState } from '../lib/useBilling';

interface TrialBannerProps {
  billing: BillingState;
}

export function TrialBanner({ billing }: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (!billing.warning) return null;
  if (!billing.allowed) return null;

  const days = billing.daysRemaining ?? 0;
  const isLastDay = days <= 1;

  const message = billing.status === 'trial'
    ? isLastDay
      ? 'Seu período de teste termina hoje! Renove para continuar usando sem interrupção.'
      : `Seu período de teste vence em ${days} dia${days > 1 ? 's' : ''}. Renove para não perder o acesso.`
    : isLastDay
      ? 'Seu acesso vence hoje! Renove agora para continuar usando.'
      : `Seu acesso vence em ${days} dia${days > 1 ? 's' : ''}. Renove para continuar usando sem interrupção.`;

  return (
    <div className="relative flex items-center gap-3 px-4 py-3 bg-amber-50 border-b border-amber-200">
      <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
      <p className="text-sm text-amber-800 font-medium flex-1">{message}</p>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-500 hover:text-amber-700 transition-colors flex-shrink-0"
        aria-label="Fechar aviso"
      >
        <X size={16} />
      </button>
    </div>
  );
}

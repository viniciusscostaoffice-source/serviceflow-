import { useState } from 'react';
import { Lock, QrCode, Copy, Check, RefreshCw, X, CreditCard, Loader2 } from 'lucide-react';
import { useBilling } from '../lib/useBilling';

type PaymentMethod = 'pix' | 'cartao';

// ──────────────────────────────────────────────
// Modal Pix
// ──────────────────────────────────────────────
function PixModal({
  pixData,
  onClose,
  onVerify,
  verifying,
  verifyMsg,
}: {
  pixData: NonNullable<ReturnType<typeof useBilling>['pixData']>;
  onClose: () => void;
  onVerify: () => void;
  verifying: boolean;
  verifyMsg: string | null;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!pixData.pixCopyPaste) return;
    navigator.clipboard.writeText(pixData.pixCopyPaste).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  const expiresLabel = pixData.expiresAt
    ? new Date(pixData.expiresAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white shadow-2xl border-4 border-black">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <QrCode size={22} className="text-primary" />
            <span className="font-display text-lg text-white uppercase">Pague com Pix</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {pixData.pixQrCodeBase64 ? (
            <div className="flex flex-col items-center">
              <div className="border-4 border-black p-3 inline-block">
                <img
                  src={`data:image/png;base64,${pixData.pixQrCodeBase64}`}
                  alt="QR Code Pix"
                  className="w-48 h-48 object-contain"
                />
              </div>
              {expiresLabel && (
                <p className="text-xs text-gray-500 mt-2">QR Code válido até {expiresLabel}</p>
              )}
            </div>
          ) : pixData.ticketUrl ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-16 h-16 bg-[#0A0A0A] flex items-center justify-center">
                <QrCode size={32} className="text-primary" />
              </div>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                Clique abaixo para abrir a página de pagamento Pix.<br/>
                Após pagar, clique em <strong>"Já paguei"</strong>.
              </p>
              <a
                href={pixData.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-[#0A0A0A] font-display text-base uppercase hover:bg-[#FF8A3D] transition-colors"
              >
                <QrCode size={18} />
                Abrir página Pix
              </a>
              {expiresLabel && (
                <p className="text-xs text-gray-400">Expira às {expiresLabel}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-gray-50 border border-gray-200">
              <p className="text-gray-400 text-sm">QR Code não disponível</p>
            </div>
          )}

          {pixData.pixCopyPaste && (
            <div>
              <p className="text-xs font-bold uppercase text-gray-500 mb-1.5">Pix Copia e Cola</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-700 font-mono truncate">
                  {pixData.pixCopyPaste}
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#0A0A0A] text-white text-xs font-bold uppercase hover:bg-primary transition-colors whitespace-nowrap"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          )}

          <div className="bg-primary/10 border-l-4 border-primary px-4 py-3">
            <p className="text-sm text-[#0A0A0A] font-medium">
              Após o pagamento, seu acesso será liberado automaticamente em alguns instantes.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={onVerify}
              disabled={verifying}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0A0A0A] text-white font-display text-base uppercase hover:bg-primary transition-colors disabled:opacity-60"
            >
              <RefreshCw size={16} className={verifying ? 'animate-spin' : ''} />
              {verifying ? 'Verificando...' : 'Já paguei — verificar acesso'}
            </button>
            {verifyMsg && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 text-center">
                {verifyMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Modal Cartão — redireciona para Abacatepay
// ──────────────────────────────────────────────
function CartaoModal({ onClose, onPay, loading, error }: {
  onClose: () => void;
  onPay: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white shadow-2xl border-4 border-black">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <CreditCard size={22} className="text-primary" />
            <span className="font-display text-lg text-white uppercase">Pagar com Cartão</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center text-center space-y-5">
          <div className="w-16 h-16 bg-[#0A0A0A] flex items-center justify-center">
            <CreditCard size={32} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-2xl text-[#0A0A0A] uppercase">Cartão de Crédito</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Você será redirecionado para a página segura do Abacatepay para inserir os dados do cartão. Em seguida, volte aqui — o acesso é liberado automaticamente.
            </p>
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium w-full text-left bg-red-50 px-3 py-2 border border-red-200">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2 w-full">
            <button
              onClick={onPay}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-[#0A0A0A] font-display text-lg uppercase hover:bg-[#0A0A0A] hover:text-white transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <CreditCard size={20} />}
              {loading ? 'Gerando link...' : 'Ir para pagamento'}
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 border-2 border-gray-200 text-gray-500 font-bold text-sm uppercase hover:border-black hover:text-black transition-colors"
            >
              Voltar
            </button>
          </div>

          <p className="text-xs text-gray-400 flex items-center gap-1">
            🔒 Pagamento processado com segurança pelo Abacatepay
          </p>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Tela de bloqueio com escolha Pix / Cartão
// ──────────────────────────────────────────────
function AccessBlocked({ onSelect, loading, error }: {
  onSelect: (method: PaymentMethod) => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0A0A0A] mx-auto">
          <Lock size={36} className="text-primary" />
        </div>

        <div className="space-y-3">
          <h1 className="font-display text-4xl sm:text-5xl uppercase text-[#0A0A0A]">
            Seu acesso expirou
          </h1>
          <p className="text-gray-600 text-lg max-w-sm mx-auto leading-relaxed">
            Para continuar usando, escolha como deseja pagar a mensalidade.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Pix */}
          <button
            onClick={() => onSelect('pix')}
            disabled={loading}
            className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all group disabled:opacity-60"
          >
            <div className="w-12 h-12 bg-[#0A0A0A] group-hover:bg-primary transition-colors flex items-center justify-center">
              <QrCode size={24} className="text-white" />
            </div>
            <div className="text-center">
              <p className="font-display text-lg uppercase text-[#0A0A0A]">Pix</p>
              <p className="text-xs text-gray-500 mt-0.5">Instantâneo · Sem taxas</p>
            </div>
            {loading && (
              <RefreshCw size={14} className="animate-spin text-primary" />
            )}
          </button>

          {/* Cartão */}
          <button
            onClick={() => onSelect('cartao')}
            className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-[#0A0A0A] group-hover:bg-primary transition-colors flex items-center justify-center">
              <CreditCard size={24} className="text-white" />
            </div>
            <div className="text-center">
              <p className="font-display text-lg uppercase text-[#0A0A0A]">Cartão</p>
              <p className="text-xs text-gray-500 mt-0.5">Crédito ou débito</p>
            </div>
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-sm font-medium">{error}</p>
        )}

        <p className="text-xs text-gray-400">
          Pagamento 100% seguro via Abacatepay. Dúvidas? Fale conosco no WhatsApp.
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// BillingGate — componente principal
// ──────────────────────────────────────────────
export function BillingGate({ children }: { children: React.ReactNode }) {
  const { billing, pixData, pixLoading, pixError, createPix, createCard, verifyPayment, clearPix } = useBilling();
  const [modal, setModal] = useState<PaymentMethod | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);

  async function handleSelect(method: PaymentMethod) {
    if (method === 'pix') {
      setVerifyMsg(null);
      await createPix('basico');
    }
    setModal(method);
  }

  async function handleCardPay() {
    await createCard('basico');
    setModal(null);
  }

  async function handleVerify() {
    setVerifying(true);
    setVerifyMsg(null);
    await verifyPayment();
    setVerifying(false);
    // billing.allowed atualizado via estado — BillingGate re-renderiza automaticamente
    // Se ainda bloqueado, mostrar feedback
    setVerifyMsg('Pagamento ainda não confirmado. Aguarde alguns instantes e tente novamente.');
  }

  function handleCloseModal() {
    setModal(null);
    setVerifyMsg(null);
    clearPix();
  }

  if (billing.status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!billing.allowed) {
    return (
      <>
        <AccessBlocked onSelect={handleSelect} loading={pixLoading} error={pixError} />

        {modal === 'pix' && pixData && (
          <PixModal
            pixData={pixData}
            onClose={handleCloseModal}
            onVerify={handleVerify}
            verifying={verifying}
            verifyMsg={verifyMsg}
          />
        )}

        {modal === 'cartao' && (
          <CartaoModal
            onClose={handleCloseModal}
            onPay={handleCardPay}
            loading={pixLoading}
            error={pixError}
          />
        )}
      </>
    );
  }

  return <>{children}</>;
}

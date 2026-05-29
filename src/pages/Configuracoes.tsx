import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Shield, X, QrCode, CreditCard, CheckCircle2, Clock, Copy, Check, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useBilling } from '../lib/useBilling';

const PLANOS = [
  {
    id: 'basico',
    nome: 'Básico',
    preco: 'R$ 59,00/mês',
    recursos: ['Até 3 mecânicos', 'Ordens de serviço', 'Relatórios básicos'],
  },
  {
    id: 'profissional',
    nome: 'Profissional',
    preco: 'R$ 80,00/mês',
    recursos: ['Até 10 mecânicos', 'Relatórios avançados', 'Fechamento mensal'],
  },
  {
    id: 'premium',
    nome: 'Premium',
    preco: 'R$ 120,00/mês',
    recursos: ['Mecânicos ilimitados', 'Todos os relatórios', 'Suporte prioritário'],
  },
];

function AssinaturaModal({ onClose }: { onClose: () => void }) {
  const { billing, createPix, createCard, verifyPayment, clearPix, pixData, pixLoading, pixError } = useBilling();
  const [planoSelecionado, setPlanoSelecionado] = useState('basico');
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);

  const statusLabel: Record<string, { label: string; color: string }> = {
    active:          { label: 'Ativo',              color: 'text-green-600' },
    trial:           { label: 'Trial',               color: 'text-blue-600' },
    payment_pending: { label: 'Pagamento Pendente',  color: 'text-amber-600' },
    blocked:         { label: 'Bloqueado',           color: 'text-red-600' },
    loading:         { label: '...',                 color: 'text-gray-400' },
  };

  const s = statusLabel[billing.status] ?? statusLabel.blocked;

  async function handlePix() {
    setVerifyMsg(null);
    await createPix(planoSelecionado);
  }

  async function handleCard() {
    await createCard(planoSelecionado);
  }

  async function handleVerify() {
    setVerifying(true);
    setVerifyMsg(null);
    await verifyPayment();
    setVerifying(false);
    setVerifyMsg('Pagamento ainda não confirmado. Aguarde e tente novamente.');
  }

  function handleCopy() {
    if (!pixData?.pixCopyPaste) return;
    navigator.clipboard.writeText(pixData.pixCopyPaste).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  function handleBack() {
    clearPix();
    setVerifyMsg(null);
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white border-4 border-black shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 bg-[#0A0A0A] sticky top-0">
          <span className="font-display text-lg text-white uppercase">Minha Assinatura</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* QR Code PIX inline */}
          {pixData ? (
            <div className="space-y-4">
              {pixData.pixQrCodeBase64 && (
                <div className="flex flex-col items-center">
                  <div className="border-4 border-black p-3 inline-block">
                    <img src={`data:image/png;base64,${pixData.pixQrCodeBase64}`} alt="QR Code Pix" className="w-48 h-48 object-contain" />
                  </div>
                  {pixData.expiresAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Válido até {new Date(pixData.expiresAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              )}

              {pixData.pixCopyPaste && (
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">Pix Copia e Cola</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-700 font-mono truncate">
                      {pixData.pixCopyPaste}
                    </div>
                    <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-2 bg-[#0A0A0A] text-white text-xs font-bold uppercase hover:bg-primary transition-colors whitespace-nowrap">
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-primary/10 border-l-4 border-primary px-4 py-3">
                <p className="text-sm text-[#0A0A0A] font-medium">Após o pagamento, seu acesso será liberado automaticamente.</p>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={handleVerify} disabled={verifying} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0A0A0A] text-white font-display text-sm uppercase hover:bg-primary transition-colors disabled:opacity-60">
                  <RefreshCw size={14} className={verifying ? 'animate-spin' : ''} />
                  {verifying ? 'Verificando...' : 'Já paguei — verificar acesso'}
                </button>
                {verifyMsg && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 text-center">{verifyMsg}</p>}
                <button onClick={handleBack} className="w-full px-4 py-2 border-2 border-gray-200 text-gray-500 text-sm font-bold uppercase hover:border-black hover:text-black transition-colors">
                  Voltar
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Status atual */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                  <p className={`font-bold text-lg ${s.color}`}>{s.label}</p>
                </div>
                {billing.status === 'active' ? (
                  <CheckCircle2 size={28} className="text-green-500" />
                ) : (
                  <Clock size={28} className="text-amber-500" />
                )}
              </div>

              {billing.accessExpiresAt && (
                <p className="text-sm text-gray-500 text-center">
                  Acesso válido até{' '}
                  <span className="font-bold text-gray-700">
                    {new Date(billing.accessExpiresAt).toLocaleDateString('pt-BR')}
                  </span>
                </p>
              )}

              {billing.daysRemaining !== null && billing.daysRemaining <= 7 && (
                <div className="bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                  Seu acesso expira em <strong>{billing.daysRemaining} dias</strong>. Renove para não perder o acesso.
                </div>
              )}

              {/* Seleção de plano */}
              <div className="border-t pt-4 space-y-3">
                <p className="text-xs text-gray-500 uppercase font-bold">Escolha o Plano</p>
                {PLANOS.map(plano => (
                  <button
                    key={plano.id}
                    onClick={() => setPlanoSelecionado(plano.id)}
                    className={`w-full text-left p-3 border-2 transition-all ${
                      planoSelecionado === plano.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm uppercase text-[#0A0A0A]">{plano.nome}</span>
                      <span className="font-bold text-sm text-primary">{plano.preco}</span>
                    </div>
                    <ul className="mt-1 space-y-0.5">
                      {plano.recursos.map(r => (
                        <li key={r} className="text-xs text-gray-500 flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-primary shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              {pixError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2">{pixError}</p>}

              {/* Botões de pagamento */}
              <div className="flex flex-col gap-2">
                <button onClick={handlePix} disabled={pixLoading} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0A0A0A] text-white font-display text-sm uppercase hover:bg-primary transition-colors disabled:opacity-60">
                  {pixLoading ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
                  {pixLoading ? 'Gerando PIX...' : 'Pagar com Pix'}
                </button>
                <button onClick={handleCard} disabled={pixLoading} className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 text-gray-700 font-bold text-sm uppercase hover:border-black hover:text-black transition-colors disabled:opacity-60">
                  <CreditCard size={16} />
                  Pagar com Cartão
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function Configuracoes() {
  const nomeOficina = localStorage.getItem('sf_oficina') || '';
  const nomeUsuario = localStorage.getItem('sf_usuario') || '';
  const emailUsuario = localStorage.getItem('sf_email') || '';
  const avatarUrl = localStorage.getItem('sf_avatar') || '';

  const [oficina, setOficina] = useState(nomeOficina);
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [showAssinatura, setShowAssinatura] = useState(false);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sf_oficina', oficina);
    toast.success('Informações da oficina atualizadas');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="font-display text-3xl uppercase text-secondary">Configurações</h1>
        <p className="text-gray-500">Gerencie os dados da sua oficina e assinatura.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dados da Oficina */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Oficina</CardTitle>
            <CardDescription>Informações que aparecem nas suas ordens de serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Oficina</Label>
                <Input value={oficina} onChange={e => setOficina(e.target.value)} placeholder="Nome da sua oficina" />
              </div>
              <div className="space-y-2">
                <Label>CNPJ <span className="text-gray-400 text-xs">(opcional)</span></Label>
                <Input value={cnpj} onChange={e => setCnpj(e.target.value)} placeholder="00.000.000/0001-00" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(00) 90000-0000" />
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Rua, número — Cidade, UF" />
              </div>
              <Button type="submit" className="bg-primary hover:bg-[#E55A15] text-white">
                Salvar Dados
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Usuário logado */}
          <Card>
            <CardHeader>
              <CardTitle>Minha Conta</CardTitle>
              <CardDescription>Responsável pelo painel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={nomeUsuario} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {nomeUsuario.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm flex items-center gap-1.5 truncate">
                    {nomeUsuario || 'Usuário'}
                    <Shield size={13} className="text-primary shrink-0" />
                  </p>
                  <p className="text-xs text-gray-500 truncate">{emailUsuario || 'Admin'}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">Você</span>
              </div>
            </CardContent>
          </Card>

          {/* Plano */}
          <Card>
            <CardHeader>
              <CardTitle>Meu Plano</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-primary font-bold text-lg uppercase tracking-wider">ServiceFlow Pro</p>
                <p className="text-sm text-gray-600 mt-1">Mecânicos ilimitados · Relatórios avançados</p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setShowAssinatura(true)}>
                Gerenciar Assinatura
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {showAssinatura && <AssinaturaModal onClose={() => setShowAssinatura(false)} />}
    </div>
  );
}

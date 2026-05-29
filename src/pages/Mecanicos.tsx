import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Plus, Search, Phone, ChevronRight, Check, Pencil, X, Trash2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../lib/AppContext';
import { useBilling } from '../lib/useBilling';

function ComissaoInline({ mecId, value, onSave }: { mecId: number; value: number; onSave: (id: number, v: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setDraft(String(value));
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function confirm() {
    const parsed = parseFloat(draft);
    if (isNaN(parsed) || parsed < 0 || parsed > 100) {
      toast.error('Informe um valor entre 0 e 100.');
      return;
    }
    onSave(mecId, parsed);
    setEditing(false);
    toast.success('Comissão atualizada!');
  }

  function cancel() {
    setDraft(String(value));
    setEditing(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') confirm();
    if (e.key === 'Escape') cancel();
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
        <Input
          ref={inputRef}
          type="number"
          min={0}
          max={100}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          className="h-8 w-20 text-center font-bold text-lg p-1"
        />
        <span className="font-bold text-lg text-gray-400">%</span>
        <button
          onClick={confirm}
          className="h-7 w-7 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
        >
          <Check size={14} />
        </button>
        <button
          onClick={cancel}
          className="h-7 w-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => { e.preventDefault(); startEdit(); }}
      className="flex items-center gap-2 group/edit"
      title="Clique para editar a comissão"
    >
      <span className="text-2xl font-display text-secondary">{value}%</span>
      <Pencil size={13} className="text-gray-300 group-hover/edit:text-primary transition-colors" />
    </button>
  );
}

function TelefoneInline({ mecId, value, onSave }: { mecId: number; value: string; onSave: (id: number, fone: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit(e: React.MouseEvent) {
    e.preventDefault();
    setDraft(value);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  async function confirm(e: React.MouseEvent) {
    e.preventDefault();
    await onSave(mecId, draft);
    setEditing(false);
    toast.success('Telefone atualizado!');
  }

  function cancel(e: React.MouseEvent) {
    e.preventDefault();
    setDraft(value);
    setEditing(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { onSave(mecId, draft); setEditing(false); toast.success('Telefone atualizado!'); }
    if (e.key === 'Escape') { setDraft(value); setEditing(false); }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1" onClick={e => e.preventDefault()}>
        <Input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKey}
          className="h-7 w-36 text-sm p-1"
          placeholder="Ex: 11999998888"
        />
        <button onClick={confirm} className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600">
          <Check size={12} />
        </button>
        <button onClick={cancel} className="h-6 w-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-300">
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={startEdit}
      className="flex items-center gap-1 group/tel text-gray-500 hover:text-primary transition-colors"
      title="Clique para editar o telefone"
    >
      <Phone size={13} />
      <span className="text-sm">{value || 'Sem telefone'}</span>
      <Pencil size={11} className="text-gray-300 group-hover/tel:text-primary transition-colors" />
    </button>
  );
}

export function Mecanicos() {
  const { mecanicos, atualizarComissao, atualizarTelefone, excluirMecanico, ordens, adicionarMecanico } = useAppContext();
  const { billing } = useBilling();
  const noLimite = mecanicos.length >= billing.mecanicosLimit;
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteComissao, setInviteComissao] = useState('15');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmExcluir, setConfirmExcluir] = useState<number | null>(null);

  const APP_MECANICO_URL = 'https://serviceflow-mecanico.vercel.app';

  const now = new Date();
  const mes = now.getMonth() + 1;
  const ano = now.getFullYear();

  const filtered = mecanicos.filter((m) =>
    m.nome.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (noLimite) {
      const nomeP = billing.plan.charAt(0).toUpperCase() + billing.plan.slice(1);
      toast.error(`Plano ${nomeP} permite até ${billing.mecanicosLimit} mecânicos. Faça upgrade para adicionar mais.`);
      return;
    }
    const comissao = parseFloat(inviteComissao);
    if (isNaN(comissao) || comissao < 0 || comissao > 100) {
      toast.error('Comissão deve ser entre 0 e 100.');
      return;
    }
    setSaving(true);
    try {
      await adicionarMecanico(inviteName, invitePhone, comissao);
      const primeiroNome = inviteName.split(' ')[0];
      const linkAcesso = `${APP_MECANICO_URL}/criar-senha?nome=${encodeURIComponent(inviteName)}`;
      const msg = encodeURIComponent(
        `Olá ${primeiroNome}! 👋\n\nVocê foi adicionado à equipe no *ServiceFlow Oficina*.\n\n` +
        `📱 Acesse o app pelo link abaixo e crie sua senha:\n${linkAcesso}\n\n` +
        `📞 Login: seu número de celular\n` +
        `🔑 Crie sua senha no primeiro acesso\n\n` +
        `Qualquer dúvida é só chamar!`
      );
      const phone = invitePhone.replace(/\D/g, '');
      window.open(`https://wa.me/55${phone}?text=${msg}`, '_blank');
      toast.success(`${inviteName} adicionado com sucesso!`);
      setIsInviteOpen(false);
      setInviteName('');
      setInvitePhone('');
      setInviteComissao('15');
    } catch {
      toast.error('Erro ao adicionar mecânico. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  async function handleExcluir(mecId: number) {
    await excluirMecanico(mecId);
    setConfirmExcluir(null);
    toast.success('Mecânico removido.');
  }

  function enviarLinkWhatsApp(mec: { nome: string; fone: string }) {
    const phone = mec.fone.replace(/\D/g, '');
    if (!phone) { toast.error('Este mecânico não tem telefone cadastrado.'); return; }
    const primeiroNome = mec.nome.split(' ')[0];
    const linkAcesso = `${APP_MECANICO_URL}/criar-senha?nome=${encodeURIComponent(mec.nome)}`;
    const msg = encodeURIComponent(
      `Olá ${primeiroNome}! 👋\n\nAqui está seu link de acesso ao *ServiceFlow Oficina*:\n${linkAcesso}\n\n` +
      `📞 Login: seu número de celular`
    );
    window.open(`https://wa.me/55${phone}?text=${msg}`, '_blank');
  }

  function osMes(mecId: number) {
    return ordens.filter((os) => {
      const d = new Date(os.data);
      return os.mecanicoId === mecId && d.getFullYear() === ano && d.getMonth() + 1 === mes && os.status !== 'cancelada';
    }).length;
  }

  function comissaoMes(mecId: number) {
    return ordens
      .filter((os) => {
        const d = new Date(os.data);
        return os.mecanicoId === mecId && d.getFullYear() === ano && d.getMonth() + 1 === mes && os.status !== 'cancelada';
      })
      .reduce((s, os) => s + os.comissao, 0);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-secondary">Mecânicos</h1>
          <p className="text-gray-500">Gerencie sua equipe e comissões padrão.</p>
        </div>

        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger render={<Button className="bg-primary hover:bg-[#E55A15] text-white" disabled={noLimite} title={noLimite ? `Limite do plano atingido (${billing.mecanicosLimit} mecânicos)` : undefined} />}>
            <Plus className="mr-2" size={20} />
            {noLimite ? `Limite atingido (${mecanicos.length}/${billing.mecanicosLimit})` : 'Convidar Mecânico'}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="uppercase font-display">Adicionar Mecânico</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input required value={inviteName} onChange={(e) => setInviteName(e.target.value)} placeholder="Ex: João Mecânico" />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input required value={invitePhone} onChange={(e) => setInvitePhone(e.target.value)} placeholder="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label>Comissão Padrão Inicial (%)</Label>
                <Input type="number" value={inviteComissao} onChange={e => setInviteComissao(e.target.value)} min={0} max={100} />
                <p className="text-xs text-gray-400">Pode ser alterada a qualquer momento no card do mecânico.</p>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={saving} className="bg-primary hover:bg-[#E55A15] text-white">
                  {saving ? 'Salvando...' : 'Adicionar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar mecânico..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((mec) => (
          <Card key={mec.id} className="hover:shadow-lg transition-all hover:border-primary/40 h-full flex flex-col">
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{mec.nome}</CardTitle>
                <CardDescription>
                  <TelefoneInline mecId={mec.id} value={mec.fone ?? ''} onSave={atualizarTelefone} />
                </CardDescription>
              </div>
              <div className="flex items-center gap-1">
                {/* WhatsApp */}
                <button
                  onClick={() => enviarLinkWhatsApp(mec)}
                  title="Enviar link via WhatsApp"
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors"
                >
                  <MessageCircle size={17} />
                </button>
                {/* Excluir */}
                {confirmExcluir === mec.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleExcluir(mec.id)}
                      className="h-7 px-2 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-600"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setConfirmExcluir(null)}
                      className="h-7 px-2 rounded bg-gray-100 text-gray-500 text-xs hover:bg-gray-200"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmExcluir(mec.id)}
                    title="Excluir mecânico"
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                {/* Avatar */}
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-base shrink-0 ml-1">
                  {mec.nome.charAt(0)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col pt-2">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Comissão Padrão</p>
                <ComissaoInline mecId={mec.id} value={mec.comissaoPadrao} onSave={atualizarComissao} />
                <p className="text-[11px] text-gray-400 mt-1">
                  Clique no valor para editar · Enter para salvar · Esc para cancelar
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center bg-white border border-gray-100 rounded-lg py-2">
                  <p className="text-xs text-gray-400 uppercase font-bold">OSs (mês)</p>
                  <p className="text-xl font-display text-secondary">{osMes(mec.id)}</p>
                </div>
                <div className="text-center bg-white border border-gray-100 rounded-lg py-2">
                  <p className="text-xs text-gray-400 uppercase font-bold">Comissão</p>
                  <p className="text-xl font-display text-green-600">
                    {comissaoMes(mec.id).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>

              <Link
                to={`/mecanicos/${mec.id}`}
                className="mt-auto flex items-center justify-between text-sm font-medium text-gray-500 hover:text-primary transition-colors pt-3 border-t"
              >
                Ver Relatório Completo
                <ChevronRight size={16} />
              </Link>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">
            Nenhum mecânico encontrado.
          </div>
        )}
      </div>
    </div>
  );
}

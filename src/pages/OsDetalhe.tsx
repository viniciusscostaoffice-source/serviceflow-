import { useState, useEffect, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { ArrowLeft, Edit, FileText, Wrench as WrenchIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../lib/AppContext';
import type { EditarOSInput } from '../lib/AppContext';

interface OSDetalhe {
  id: number;
  num: string;
  data: string;
  status: string;
  cliente: string;
  veiculo: string;
  placa: string;
  descricao: string;
  mecanicoPrincipal: string;
  mecanicoId: number;
  ajudante: string | null;
  ajudanteId: number | null;
  percentualAjudante: number;
  maoDeObra: number;
  pecas: number;
  comissaoMecanico: number;
  comissaoAjudante: number;
  comissao: number;
  edicoes: { data: string; motivo: string }[];
}

const statusMap: Record<string, { label: string; bg: string }> = {
  concluida:    { label: 'Concluída',  bg: 'bg-success text-white' },
  aberta:       { label: 'Aberta',     bg: 'bg-secondary text-white' },
  paga:         { label: 'Paga',       bg: 'bg-gray-800 text-white' },
  em_pendencia: { label: 'Pendência',  bg: 'bg-red-500 text-white' },
  cancelada:    { label: 'Cancelada',  bg: 'bg-red-500 text-white' },
};

export function OsDetalhe() {
  const { id } = useParams();
  const { mecanicos, editarOS, recarregar } = useAppContext();
  const [os, setOs] = useState<OSDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [motivoEdicao, setMotivoEdicao] = useState('');
  const [novoMaoObra, setNovoMaoObra] = useState<number>(0);
  const [novoPecas, setNovoPecas] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function buscar() {
      setLoading(true);
      const { data, error } = await supabase
        .from('ordens_servico')
        .select('*, mecanicos!mecanico_id(nome), ajudante:mecanicos!ajudante_id(nome)')
        .eq('id', id)
        .single();

      if (error || !data) { setLoading(false); return; }

      const { data: edicoes } = await supabase
        .from('edicoes_os')
        .select('motivo, criado_em')
        .eq('os_id', id)
        .order('criado_em', { ascending: false });

      setOs({
        id:                 data.id,
        num:                `#${data.num ?? data.id}`,
        data:               new Date(data.data).toLocaleDateString('pt-BR'),
        status:             data.status,
        cliente:            data.cliente,
        veiculo:            data.veiculo,
        placa:              data.placa ?? '',
        descricao:          data.descricao ?? '',
        mecanicoPrincipal:  (data.mecanicos as { nome: string } | null)?.nome ?? '',
        mecanicoId:         data.mecanico_id,
        ajudante:           (data.ajudante as { nome: string } | null)?.nome ?? null,
        ajudanteId:         data.ajudante_id ?? null,
        percentualAjudante: Number(data.percentual_ajudante ?? 0),
        maoDeObra:          Number(data.total_mao_obra),
        pecas:              Number(data.total_pecas),
        comissaoMecanico:   Number(data.comissao_mecanico ?? data.comissao),
        comissaoAjudante:   Number(data.comissao_ajudante ?? 0),
        comissao:           Number(data.comissao),
        edicoes:            (edicoes ?? []).map(e => ({
          data:   new Date(e.criado_em).toLocaleString('pt-BR'),
          motivo: e.motivo,
        })),
      });
      setLoading(false);
    }
    buscar();
  }, [id]);

  useEffect(() => {
    if (os) {
      setNovoMaoObra(os.maoDeObra);
      setNovoPecas(os.pecas);
    }
  }, [os]);

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (motivoEdicao.length < 5) { toast.error('Informe um motivo válido.'); return; }
    if (novoMaoObra < 0 || novoPecas < 0) { toast.error('Valores não podem ser negativos.'); return; }
    if (!os) return;
    setSaving(true);
    try {
      const mec = mecanicos.find(m => m.id === os.mecanicoId);
      const input: EditarOSInput = {
        id:                 os.id,
        maoDeObra:          novoMaoObra,
        pecas:              novoPecas,
        motivo:             motivoEdicao,
        mecanicoId:         os.mecanicoId,
        comissaoPadrao:     mec?.comissaoPadrao ?? 0,
        ajudanteId:         os.ajudanteId,
        percentualAjudante: os.percentualAjudante,
      };
      await editarOS(input);
      recarregar();
      toast.success('OS atualizada! Comissão recalculada.');
      setIsEditOpen(false);
      setMotivoEdicao('');
      // Atualiza estado local com os valores recalculados
      const novaComissaoTotal    = (novoMaoObra * (mec?.comissaoPadrao ?? 0)) / 100;
      const novaComissaoAjudante = os.ajudanteId ? novaComissaoTotal * (os.percentualAjudante / 100) : 0;
      const novaComissaoMecanico = novaComissaoTotal - novaComissaoAjudante;
      setOs(prev => prev ? {
        ...prev,
        maoDeObra:        novoMaoObra,
        pecas:            novoPecas,
        comissao:         novaComissaoTotal,
        comissaoMecanico: novaComissaoMecanico,
        comissaoAjudante: novaComissaoAjudante,
        edicoes:          [{ data: new Date().toLocaleString('pt-BR'), motivo: motivoEdicao }, ...prev.edicoes],
      } : null);
    } catch {
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!os) return <div className="text-center py-20 text-gray-400">OS não encontrada.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" render={<Link to="/os" />}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-display text-3xl uppercase text-secondary">OS {os.num}</h1>
          <Badge className={statusMap[os.status]?.bg || 'bg-gray-200'}>
            {statusMap[os.status]?.label || os.status}
          </Badge>
        </div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger render={<Button variant="outline" className="text-secondary border-secondary" />}>
            <Edit className="w-4 h-4 mr-2" /> Editar OS
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="uppercase font-display">Editar Ordem de Serviço</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4 pt-4">
              <div className="bg-orange-50 border border-orange-200 p-3 rounded flex gap-3 text-orange-800 text-sm">
                <AlertTriangle className="shrink-0 text-orange-500" />
                <p>A comissão será recalculada automaticamente com base no novo valor da mão de obra.</p>
              </div>

              <div className="space-y-2">
                <Label>Novo Valor Mão de Obra (R$)</Label>
                <Input type="number" min="0" step="0.01" value={novoMaoObra} onChange={e => setNovoMaoObra(parseFloat(e.target.value) || 0)} />
              </div>
              <div className="space-y-2">
                <Label>Novo Valor Peças (R$)</Label>
                <Input type="number" min="0" step="0.01" value={novoPecas} onChange={e => setNovoPecas(parseFloat(e.target.value) || 0)} />
              </div>

              {/* Prévia do recálculo */}
              {os && (() => {
                const pct = mecanicos.find(m => m.id === os.mecanicoId)?.comissaoPadrao ?? 0;
                const totalComissao    = (novoMaoObra * pct) / 100;
                const comissaoAjudante = os.ajudanteId ? totalComissao * (os.percentualAjudante / 100) : 0;
                const comissaoMecanico = totalComissao - comissaoAjudante;
                return (
                  <div className="bg-primary/10 border border-primary/20 p-3 rounded text-sm space-y-1">
                    <p className="font-bold text-primary uppercase text-xs">Prévia da nova comissão</p>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Comissão total ({pct}%):</span>
                      <span className="font-bold">R$ {totalComissao.toFixed(2)}</span>
                    </div>
                    {os.ajudanteId && (
                      <>
                        <div className="flex justify-between text-gray-500">
                          <span>→ {os.mecanicoPrincipal} ({100 - os.percentualAjudante}%):</span>
                          <span>R$ {comissaoMecanico.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                          <span>→ {os.ajudante} ({os.percentualAjudante}%):</span>
                          <span>R$ {comissaoAjudante.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              <div className="space-y-2">
                <Label>Motivo da Edição <span className="text-red-500">*</span></Label>
                <Textarea
                  required
                  placeholder="Explique por que está alterando esta OS..."
                  value={motivoEdicao}
                  onChange={e => setMotivoEdicao(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={saving} className="bg-primary hover:bg-[#E55A15] text-white">
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} /> Dados do Serviço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-gray-500 mb-1">Cliente</p><p className="font-bold text-lg">{os.cliente}</p></div>
                <div><p className="text-sm text-gray-500 mb-1">Data</p><p className="font-bold text-lg">{os.data}</p></div>
                <div><p className="text-sm text-gray-500 mb-1">Veículo</p><p className="font-medium">{os.veiculo}</p></div>
                <div><p className="text-sm text-gray-500 mb-1">Placa</p><p className="font-medium">{os.placa}</p></div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Descrição</p>
                <p className="text-sm leading-relaxed">{os.descricao}</p>
              </div>
            </CardContent>
          </Card>

          {os.edicoes.length > 0 && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-orange-700 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle size={16} /> Histórico de Edições
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {os.edicoes.map((ed, idx) => (
                    <li key={idx} className="text-sm border-l-2 border-orange-300 pl-3">
                      <p className="text-orange-500/70 text-xs">{ed.data}</p>
                      <p className="text-orange-800/80 mt-0.5">{ed.motivo}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <WrenchIcon size={16} /> Equipe e Comissão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Principal: <span className="font-medium text-black">{os.mecanicoPrincipal}</span></span>
                <span className="font-bold text-success">R$ {os.comissaoMecanico.toFixed(2)}</span>
              </div>
              {os.ajudante && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Ajudante: <span className="font-medium text-black">{os.ajudante}</span></span>
                  <span className="font-bold text-success">R$ {os.comissaoAjudante.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold uppercase text-xs text-gray-500">Mão de Obra Total</span>
                <span className="font-display text-lg">R$ {os.maoDeObra.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary text-white border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-gray-400 uppercase tracking-widest">Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Peças</span>
                <span>R$ {os.pecas.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Mão de Obra</span>
                <span>R$ {os.maoDeObra.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-gray-700 flex justify-between items-center mt-4">
                <span className="font-bold text-primary uppercase text-sm">Total da OS</span>
                <span className="font-display text-2xl text-primary">R$ {(os.maoDeObra + os.pecas).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

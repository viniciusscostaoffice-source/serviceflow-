import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface Mecanico {
  id: number;
  nome: string;
  telefone: string;
  comissao_padrao: number;
  status: string;
}

interface Desempenho {
  osConcluidas: number;
  comissaoAcumulada: number;
}

export function MecanicoDetalhe() {
  const { id } = useParams();
  const [mecanico, setMecanico] = useState<Mecanico | null>(null);
  const [desempenho, setDesempenho] = useState<Desempenho>({ osConcluidas: 0, comissaoAcumulada: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [comissao, setComissao] = useState(0);

  useEffect(() => {
    if (!id) return;
    async function buscar() {
      setLoading(true);

      const { data: mec } = await supabase
        .from('mecanicos')
        .select('*')
        .eq('id', id)
        .single();

      if (mec) {
        setMecanico(mec);
        setNome(mec.nome);
        setTelefone(mec.telefone ?? '');
        setComissao(mec.comissao_padrao ?? 0);
      }

      // Desempenho do mês atual
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      const { data: os } = await supabase
        .from('ordens_servico')
        .select('comissao_mecanico, comissao_ajudante')
        .eq('mecanico_id', id)
        .eq('status', 'concluida')
        .gte('data', inicioMes.toISOString());

      const osConcluidas = os?.length ?? 0;
      const comissaoAcumulada = (os ?? []).reduce(
        (sum, o) => sum + Number(o.comissao_mecanico ?? 0),
        0
      );

      setDesempenho({ osConcluidas, comissaoAcumulada });
      setLoading(false);
    }
    buscar();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mecanico) return;
    setSaving(true);
    const { error } = await supabase
      .from('mecanicos')
      .update({ nome, telefone, comissao_padrao: comissao })
      .eq('id', mecanico.id);

    if (error) {
      toast.error('Erro ao salvar. Tente novamente.');
    } else {
      toast.success('Dados atualizados com sucesso!');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!mecanico) {
    return <div className="text-center py-20 text-gray-400">Mecânico não encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" render={<Link to="/mecanicos" />}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="font-display text-3xl uppercase text-secondary">
          Perfil do Mecânico
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input value={nome} onChange={e => setNome(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Telefone (WhatsApp)</Label>
                <Input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="Ex: 11999998888" />
              </div>
              <div className="space-y-2">
                <Label>Comissão Padrão (%)</Label>
                <Input
                  type="number" min="0" max="100" step="1"
                  value={comissao}
                  onChange={e => setComissao(Number(e.target.value))}
                />
              </div>
              <Button type="submit" disabled={saving} className="bg-primary hover:bg-[#E55A15] text-white">
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gray-50/50">
          <CardHeader>
            <CardTitle>Desempenho Mês</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">O.S Concluídas</p>
              <p className="text-2xl font-display text-secondary">{desempenho.osConcluidas}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Comissão Acumulada</p>
              <p className="text-2xl font-display text-success">
                R$ {desempenho.comissaoAcumulada.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

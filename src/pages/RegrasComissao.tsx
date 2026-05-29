import { useState, useEffect } from 'react';
import { Plus, Settings, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface Regra {
  id: number;
  servico: string;
  comissao: number;
}

export function RegrasComissao() {
  const [regras, setRegras] = useState<Regra[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNovoOpen, setIsNovoOpen] = useState(false);
  const [novoServico, setNovoServico] = useState('');
  const [novaComissao, setNovaComissao] = useState('');
  const [saving, setSaving] = useState(false);

  async function carregar() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('regras_comissao')
      .select('id, servico, comissao')
      .eq('user_id', user.id)
      .order('id');
    setRegras(data ?? []);
    setLoading(false);
  }

  useEffect(() => { carregar(); }, []);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Sessão expirada.'); setSaving(false); return; }

    const { data, error } = await supabase
      .from('regras_comissao')
      .insert({ user_id: user.id, servico: novoServico, comissao: parseFloat(novaComissao) })
      .select()
      .single();

    if (error) { toast.error('Erro ao salvar regra.'); }
    else {
      setRegras(prev => [...prev, data]);
      toast.success('Regra cadastrada com sucesso!');
      setIsNovoOpen(false);
      setNovoServico('');
      setNovaComissao('');
    }
    setSaving(false);
  };

  const handleExcluir = async (id: number) => {
    await supabase.from('regras_comissao').delete().eq('id', id);
    setRegras(prev => prev.filter(r => r.id !== id));
    toast.success('Regra removida.');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-secondary">Regras de Comissão</h1>
          <p className="text-gray-500">Defina comissões específicas por tipo de serviço.</p>
        </div>

        <Dialog open={isNovoOpen} onOpenChange={setIsNovoOpen}>
          <DialogTrigger render={<Button className="bg-primary hover:bg-[#E55A15] text-white" />}>
            <Plus className="mr-2" size={20} />
            Nova Regra
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="uppercase font-display">Cadastrar Regra Específica</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSalvar} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome do Serviço</Label>
                <Input required value={novoServico} onChange={e => setNovoServico(e.target.value)} placeholder="Ex: Alinhamento" />
                <p className="text-xs text-gray-400">Essa regra será sugerida quando o serviço for lançado.</p>
              </div>
              <div className="space-y-2">
                <Label>Comissão (%)</Label>
                <Input type="number" required min="0" max="100" value={novaComissao} onChange={e => setNovaComissao(e.target.value)} placeholder="Ex: 5" />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsNovoOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={saving} className="bg-primary hover:bg-[#E55A15] text-white">
                  {saving ? 'Salvando...' : 'Salvar Regra'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-dashed bg-gray-50/50">
            <CardHeader>
              <CardTitle className="text-lg text-gray-600 flex items-center gap-2">
                <Settings size={20} className="text-gray-400" /> Regra Padrão (Fallback)
              </CardTitle>
              <CardDescription>Aplicada quando não há regra específica</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-display text-gray-800">Comissão base do mecânico</p>
              <p className="text-sm text-gray-500 mt-2">Configure no perfil de cada mecânico.</p>
            </CardContent>
          </Card>

          {regras.map(regra => (
            <Card key={regra.id}>
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <CardTitle className="text-lg">{regra.servico}</CardTitle>
                <button
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  onClick={() => handleExcluir(regra.id)}
                >
                  <Trash2 size={16} />
                </button>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-display text-primary">{regra.comissao}%</p>
              </CardContent>
            </Card>
          ))}

          {regras.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-400 text-sm">
              Nenhuma regra cadastrada ainda. Crie uma para definir comissões por tipo de serviço.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

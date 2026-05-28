import { useState } from 'react';
import { Plus, Settings, Trash2, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function RegrasComissao() {
  const [regras, setRegras] = useState<{ id: number; servico: string; comissao: number; tipo: string }[]>([]);

  const [isNovoOpen, setIsNovoOpen] = useState(false);
  const [novoServico, setNovoServico] = useState('');
  const [novaComissao, setNovaComissao] = useState('');

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    const regra = {
      id: Date.now(),
      servico: novoServico,
      comissao: parseFloat(novaComissao),
      tipo: 'percentual'
    };
    setRegras([...regras, regra]);
    setIsNovoOpen(false);
    setNovoServico('');
    setNovaComissao('');
    toast.success('Regra cadastrada com sucesso!');
  };

  const handleExcluir = (id: number) => {
    setRegras(regras.filter(r => r.id !== id));
    toast.success('Regra removida.');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-secondary">
            Regras de Comissão
          </h1>
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
                <Label>Nome do Serviço (Exato ou Palavra-chave)</Label>
                <Input required value={novoServico} onChange={e => setNovoServico(e.target.value)} placeholder="Ex: Alinhamento" />
                <p className="text-xs text-gray-400">Essa regra será sugerida quando o serviço for lançado.</p>
              </div>
              <div className="space-y-2">
                <Label>Comissão (%)</Label>
                <Input type="number" required min="0" max="100" value={novaComissao} onChange={e => setNovaComissao(e.target.value)} placeholder="Ex: 5" />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsNovoOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-primary hover:bg-[#E55A15] text-white">Salvar Regra</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-dashed bg-gray-50/50">
          <CardHeader>
            <CardTitle className="text-lg text-gray-600 flex items-center gap-2">
              <Settings size={20} className="text-gray-400" /> Regra Padrão (Fallback)
            </CardTitle>
            <CardDescription>Aplicada quando não há regra específica</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display text-gray-800">Usa a comissão base do mecânico</p>
            <p className="text-sm text-gray-500 mt-2">Você configura isso no perfil do mecânico.</p>
          </CardContent>
        </Card>

        {regras.map(regra => (
          <Card key={regra.id}>
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <CardTitle className="text-lg">{regra.servico}</CardTitle>
              <div className="flex gap-2">
                <button className="text-gray-400 hover:text-primary transition-colors">
                  <Edit size={16} />
                </button>
                <button className="text-gray-400 hover:text-red-500 transition-colors" onClick={() => handleExcluir(regra.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display text-primary">{regra.comissao}%</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

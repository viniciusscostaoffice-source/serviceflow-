import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function MecanicoDetalhe() {
  const { id } = useParams();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Dados atualizados com sucesso!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" render={<Link to="/mecanicos" />}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="font-display text-3xl uppercase text-secondary">
          Perfil do Mecânico (ID: {id})
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
                <Input defaultValue="Carlos Souza" />
              </div>
              <div className="space-y-2">
                <Label>Telefone (WhatsApp)</Label>
                <Input defaultValue="(11) 99999-1111" />
              </div>
              <div className="space-y-2">
                <Label>Comissão Padrão Inicial (%)</Label>
                <Input type="number" defaultValue="15" />
              </div>
              <Button type="submit" className="bg-primary hover:bg-[#E55A15] text-white">
                Salvar Alterações
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
               <p className="text-2xl font-display text-secondary">45</p>
             </div>
             <div>
               <p className="text-xs text-gray-500 uppercase font-bold">Comissão Acumulada</p>
               <p className="text-2xl font-display text-success">R$ 1.250,00</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

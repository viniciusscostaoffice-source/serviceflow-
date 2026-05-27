import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { UserPlus, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function Configuracoes() {
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Informações da oficina atualizadas');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="font-display text-3xl uppercase text-secondary">
          Configurações
        </h1>
        <p className="text-gray-500">Gerencie os dados da sua oficina, acessos e assinatura.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Oficina</CardTitle>
            <CardDescription>Informações que aparecem nas suas ordens de serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveInfo} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Oficina</Label>
                <Input defaultValue="Oficina do João" />
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input defaultValue="00.000.000/0001-00" />
              </div>
              <div className="space-y-2">
                <Label>Telefone Principal</Label>
                <Input defaultValue="(11) 9999-9999" />
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                <Input defaultValue="Av. Principal, 1000 - São Paulo, SP" />
              </div>
              <Button type="submit" className="bg-primary hover:bg-[#E55A15] text-white">
                Salvar Dados
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usuários e Acessos</CardTitle>
              <CardDescription>Pessoas que podem acessar este painel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                  <div>
                    <p className="font-bold flex items-center gap-2">João Silva <Shield size={14} className="text-primary" /></p>
                    <p className="text-xs text-gray-500">joao@oficina.com (Admin)</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400" disabled>Você</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-bold">Maria Costa</p>
                    <p className="text-xs text-gray-500">maria@oficina.com (Atendente)</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">Remover</Button>
                </div>
              </div>
              
              <Button variant="outline" className="w-full text-secondary">
                <UserPlus className="w-4 h-4 mr-2" /> Convidar Novo Usuário
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meu Plano</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-primary font-bold text-lg uppercase tracking-wider">ServiceFlow Pro</p>
                <p className="text-sm text-gray-600 mt-1">Mecânicos Ilimitados, Relatórios Avançados.</p>
              </div>
              <Button variant="outline" className="w-full">Gerenciar Assinatura</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

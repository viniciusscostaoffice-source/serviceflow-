import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

export function Configuracoes() {
  const nomeOficina = localStorage.getItem('sf_oficina') || '';
  const nomeUsuario = localStorage.getItem('sf_usuario') || '';

  const [oficina, setOficina] = useState(nomeOficina);
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

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
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {nomeUsuario.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm flex items-center gap-1.5 truncate">
                    {nomeUsuario || 'Usuário'}
                    <Shield size={13} className="text-primary shrink-0" />
                  </p>
                  <p className="text-xs text-gray-500">Admin</p>
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
              <Button variant="outline" className="w-full">Gerenciar Assinatura</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

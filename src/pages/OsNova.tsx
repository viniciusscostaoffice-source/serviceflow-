import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { toast } from 'sonner';

export function OsNova() {
  const navigate = useNavigate();
  const [percentualAjudante, setPercentualAjudante] = useState([0]);
  const [maoDeObra, setMaoDeObra] = useState<number>(0);
  const [pecas, setPecas] = useState<number>(0);
  const [mecanicoSelecionado, setMecanicoSelecionado] = useState<string>('');

  // Simulating mechanics and rules config
  const mecanicos = [
    { id: '1', nome: 'Carlos', comissaoPadrao: 15 },
    { id: '2', nome: 'Paulo', comissaoPadrao: 20 },
  ];
  const regraComissaoAtual = 15; // default 15% manual for demo

  // Calcula valores em tempo real
  const mecanico = mecanicos.find(m => m.id === mecanicoSelecionado);
  const percentualUsado = mecanico ? regraComissaoAtual : 0; 
  const comissaoTotal = (maoDeObra * percentualUsado) / 100;
  const comissaoAjudante = comissaoTotal * (percentualAjudante[0] / 100);
  const comissaoMecanico = comissaoTotal - comissaoAjudante;
  const valorTotal = maoDeObra + pecas;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mecanicoSelecionado) {
      toast.error('Selecione um mecânico.');
      return;
    }
    toast.success('OS Lançada com sucesso!');
    navigate('/os');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header>
        <h1 className="font-display text-3xl uppercase text-secondary">
          Nova O.S.
        </h1>
        <p className="text-gray-500">Cadastre uma nova ordem de serviço e calcule a comissão automaticamente.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Esquerda: Dados do Cliente e Serviço */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente">Nome do Cliente</Label>
                  <Input id="cliente" placeholder="Ex: João da Silva" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="veiculo">Veículo</Label>
                    <Input id="veiculo" placeholder="Ex: Honda Civic" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placa">Placa</Label>
                    <Input id="placa" placeholder="Ex: ABC-1234" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Serviço e Valores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição do Serviço</Label>
                  <Input id="descricao" placeholder="Ex: Troca de pastilhas de freio..." required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mao_obra">Valor Mão de Obra (R$)</Label>
                    <Input 
                      id="mao_obra" 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={maoDeObra || ''} 
                      onChange={e => setMaoDeObra(parseFloat(e.target.value) || 0)} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pecas">Valor Peças (R$)</Label>
                    <Input 
                      id="pecas" 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={pecas || ''} 
                      onChange={e => setPecas(parseFloat(e.target.value) || 0)} 
                    />
                    <p className="text-xs text-gray-500">As peças não entram no cálculo base da comissão.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Direita: Mecânico e Prévia */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mecânico Responsável</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Mecânico Principal</Label>
                  <Select value={mecanicoSelecionado} onValueChange={setMecanicoSelecionado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um mecânico" />
                    </SelectTrigger>
                    <SelectContent>
                      {mecanicos.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.nome} ({m.comissaoPadrao}%)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <Label>Ajudante (Opcional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhum ajudante" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {mecanicos.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <Label>Divisão para o Ajudante</Label>
                    <span className="font-bold text-primary">{percentualAjudante[0]}%</span>
                  </div>
                  <Slider 
                    value={percentualAjudante} 
                    onValueChange={setPercentualAjudante} 
                    max={100} 
                    step={5} 
                  />
                  <p className="text-xs text-gray-500">Porcentagem da comissão total que vai para o ajudante.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-[0_0_20px_rgba(255,107,26,0.1)] bg-[#FFF5EF]">
              <CardHeader className="pb-2">
                <CardTitle className="text-primary text-sm uppercase tracking-wider">Prévia da Comissão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor Total OS:</span>
                  <span className="font-bold text-gray-900">R$ {valorTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Comissão p/ {mecanico?.nome || 'Mecânico'}:</span>
                  <span className="font-bold text-gray-900">R$ {comissaoMecanico.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-b border-primary/20 pb-2">
                  <span className="text-gray-600">Comissão Ajudante:</span>
                  <span className="font-bold text-gray-900">R$ {comissaoAjudante.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-lg font-bold text-primary">Total Comissão:</span>
                  <span className="text-2xl font-display text-primary">R$ {comissaoTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/os')}>
                Cancelar / Rascunho
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-[#E55A15] text-white uppercase font-bold tracking-wider">
                Lançar OS
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

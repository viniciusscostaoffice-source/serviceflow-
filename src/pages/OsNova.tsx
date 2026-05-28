import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { toast } from 'sonner';
import { useAppContext } from '../lib/AppContext';

export function OsNova() {
  const navigate = useNavigate();
  const { mecanicos, adicionarOS } = useAppContext();

  const [cliente, setCliente] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [placa, setPlaca] = useState('');
  const [descricao, setDescricao] = useState('');
  const [maoDeObra, setMaoDeObra] = useState<number>(0);
  const [pecas, setPecas] = useState<number>(0);
  const [mecanicoId, setMecanicoId] = useState<string>('');
  const [ajudanteId, setAjudanteId] = useState<string>('none');
  const [percentualAjudante, setPercentualAjudante] = useState([0]);
  const [saving, setSaving] = useState(false);

  const mecanico = mecanicos.find(m => String(m.id) === mecanicoId);
  const ajudante = mecanicos.find(m => String(m.id) === ajudanteId);

  const percentualUsado = mecanico ? mecanico.comissaoPadrao : 0;
  const comissaoTotal    = (maoDeObra * percentualUsado) / 100;
  const comissaoAjudante = ajudante ? comissaoTotal * (percentualAjudante[0] / 100) : 0;
  const comissaoMecanico = comissaoTotal - comissaoAjudante;
  const valorTotal       = maoDeObra + pecas;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mecanicoId) { toast.error('Selecione um mecânico.'); return; }
    setSaving(true);
    try {
      await adicionarOS({
        cliente,
        veiculo,
        placa,
        descricao,
        totalMaoObra:      maoDeObra,
        totalPecas:        pecas,
        mecanicoId:        Number(mecanicoId),
        ajudanteId:        ajudante ? Number(ajudanteId) : null,
        percentualAjudante: percentualAjudante[0],
        comissao:          comissaoTotal,
        comissaoMecanico,
        comissaoAjudante,
      });
      toast.success('OS lançada com sucesso!');
      navigate('/os');
    } catch {
      toast.error('Erro ao lançar OS. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header>
        <h1 className="font-display text-3xl uppercase text-secondary">Nova O.S.</h1>
        <p className="text-gray-500">Cadastre uma nova ordem de serviço e calcule a comissão automaticamente.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Dados do Cliente</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Cliente</Label>
                  <Input value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Ex: João da Silva" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Veículo</Label>
                    <Input value={veiculo} onChange={e => setVeiculo(e.target.value)} placeholder="Ex: Honda Civic" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Placa</Label>
                    <Input value={placa} onChange={e => setPlaca(e.target.value)} placeholder="Ex: ABC-1234" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Serviço e Valores</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Descrição do Serviço</Label>
                  <Input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Troca de pastilhas de freio..." required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Valor Mão de Obra (R$)</Label>
                    <Input
                      type="number" min="0" step="0.01"
                      value={maoDeObra || ''}
                      onChange={e => setMaoDeObra(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Peças (R$)</Label>
                    <Input
                      type="number" min="0" step="0.01"
                      value={pecas || ''}
                      onChange={e => setPecas(parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-gray-500">As peças não entram no cálculo base da comissão.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Mecânico Responsável</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Mecânico Principal</Label>
                  <Select value={mecanicoId} onValueChange={setMecanicoId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um mecânico" />
                    </SelectTrigger>
                    <SelectContent>
                      {mecanicos.filter(m => m.status === 'Ativo').map(m => (
                        <SelectItem key={m.id} value={String(m.id)}>
                          {m.nome} ({m.comissaoPadrao}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <Label>Ajudante (Opcional)</Label>
                  <Select value={ajudanteId} onValueChange={setAjudanteId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhum ajudante" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {mecanicos.filter(m => m.status === 'Ativo' && String(m.id) !== mecanicoId).map(m => (
                        <SelectItem key={m.id} value={String(m.id)}>{m.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {ajudanteId !== 'none' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <Label>Divisão para o Ajudante</Label>
                      <span className="font-bold text-primary">{percentualAjudante[0]}%</span>
                    </div>
                    <Slider value={percentualAjudante} onValueChange={setPercentualAjudante} max={100} step={5} />
                    <p className="text-xs text-gray-500">Porcentagem da comissão total que vai para o ajudante.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary shadow-[0_0_20px_rgba(255,107,26,0.1)] bg-[#FFF5EF]">
              <CardHeader className="pb-2">
                <CardTitle className="text-primary text-sm uppercase tracking-wider">Prévia da Comissão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base (mão de obra):</span>
                  <span className="font-bold">R$ {maoDeObra.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">% comissão:</span>
                  <span className="font-bold">{percentualUsado}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Comissão p/ {mecanico?.nome || 'Mecânico'}:</span>
                  <span className="font-bold text-gray-900">R$ {comissaoMecanico.toFixed(2)}</span>
                </div>
                {ajudanteId !== 'none' && (
                  <div className="flex justify-between text-sm border-b border-primary/20 pb-2">
                    <span className="text-gray-600">Comissão {ajudante?.nome || 'Ajudante'}:</span>
                    <span className="font-bold text-gray-900">R$ {comissaoAjudante.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 border-t border-primary/20">
                  <span className="text-lg font-bold text-primary">Total Comissão:</span>
                  <span className="text-2xl font-display text-primary">R$ {comissaoTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 pt-1 border-t border-primary/10">
                  <span>Total OS:</span>
                  <span className="font-bold text-gray-700">R$ {valorTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate('/os')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="flex-1 bg-primary hover:bg-[#E55A15] text-white uppercase font-bold tracking-wider">
                {saving ? 'Salvando...' : 'Lançar OS'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

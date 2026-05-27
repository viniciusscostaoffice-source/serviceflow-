import { useState } from 'react';
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

export function OsDetalhe() {
  const { id } = useParams();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [motivoEdicao, setMotivoEdicao] = useState('');

  // Mock data for the OS
  const os = {
    id,
    num: '#1045',
    data: '23/05/2026',
    status: 'concluida',
    cliente: 'João Silva',
    veiculo: 'VW Gol 1.6 2018',
    placa: 'ABC-1234',
    mecanicoPrincipal: 'Carlos',
    ajudante: 'Paulo',
    descricao: 'Troca de óleo, filtros e pastilhas de freio dianteiras. Revisão geral nos fluidos.',
    maoDeObra: 250.00,
    pecas: 450.00,
    comissaoMecanico: 30.00,
    comissaoAjudante: 7.50,
    edicoes: [
      { data: '24/05/2026 10:15', autor: 'João', motivo: 'Corrigido valor da mão de obra que estava digitado errado' }
    ]
  };

  const statusMap: Record<string, { label: string, bg: string }> = {
    concluida: { label: 'Concluída', bg: 'bg-success text-white' },
    aberta: { label: 'Aberta', bg: 'bg-secondary text-white' },
    paga: { label: 'Paga', bg: 'bg-gray-800 text-white' },
    em_pendencia: { label: 'Pendência', bg: 'bg-red-500 text-white' },
    cancelada: { label: 'Cancelada', bg: 'bg-red-500 text-white' }
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (motivoEdicao.length < 5) {
      toast.error('Informe um motivo válido para a edição.');
      return;
    }
    toast.success('Edição registrada com sucesso!');
    setIsEditOpen(false);
    setMotivoEdicao('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" render={<Link to="/os" />}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-display text-3xl uppercase text-secondary">
            OS {os.num}
          </h1>
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
                <p>O valor dessa OS já compôs comissões. Qualquer alteração aqui ficará registrada no histórico e pode afetar os fechamentos.</p>
              </div>
              
              <div className="space-y-2">
                <Label>Novo Valor Mão de Obra (R$)</Label>
                <Input type="number" defaultValue={os.maoDeObra} />
              </div>
              <div className="space-y-2">
                <Label>Novo Valor Peças (R$)</Label>
                <Input type="number" defaultValue={os.pecas} />
              </div>

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
                <Button type="submit" className="bg-primary hover:bg-[#E55A15] text-white">Salvar Alterações</Button>
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
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Cliente</p>
                    <p className="font-bold text-lg">{os.cliente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Data</p>
                    <p className="font-bold text-lg">{os.data}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Veículo</p>
                    <p className="font-medium">{os.veiculo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Placa</p>
                    <p className="font-medium">{os.placa}</p>
                  </div>
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
                      <p className="font-medium text-orange-900">{ed.autor} <span className="text-orange-500/70 font-normal">em {ed.data}</span></p>
                      <p className="text-orange-800/80 mt-1">{ed.motivo}</p>
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

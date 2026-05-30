import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { CheckCircle2, Factory, Users, Percent, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

export function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Step 1
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [savingStep1, setSavingStep1] = useState(false);

  // Step 2
  const [nomeMec, setNomeMec] = useState('');
  const [foneMec, setFoneMec] = useState('');
  const [comissaoMec, setComissaoMec] = useState('15');
  const [savingStep2, setSavingStep2] = useState(false);

  // Step 3
  const [servico, setServico] = useState('');
  const [comissaoServico, setComissaoServico] = useState('');
  const [savingStep3, setSavingStep3] = useState(false);

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setSavingStep1(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({
        ...(cnpj ? { tax_id: cnpj } : {}),
        ...(telefone ? { cellphone: telefone } : {}),
      }).eq('user_id', user.id);
      localStorage.setItem('sf_cnpj', cnpj);
      localStorage.setItem('sf_telefone', telefone);
    }
    setSavingStep1(false);
    setStep(2);
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setSavingStep2(true);
    if (nomeMec.trim()) {
      const { error } = await supabase.from('mecanicos').insert({
        nome: nomeMec,
        fone: foneMec,
        comissao_padrao: parseFloat(comissaoMec) || 15,
        status: 'Ativo',
      });
      if (error) { toast.error('Erro ao cadastrar mecânico.'); setSavingStep2(false); return; }
      if (foneMec) {
        const phone = foneMec.replace(/\D/g, '');
        const msg = encodeURIComponent(
          `Olá ${nomeMec.split(' ')[0]}! 👋\n\nVocê foi adicionado à equipe no *Torke Oficina*.\n\n` +
          `📱 Acesse o app:\nhttps://torkemecanico.vercel.app/criar-senha?nome=${encodeURIComponent(nomeMec)}\n\n` +
          `📞 Login: seu número de celular`
        );
        window.open(`https://wa.me/55${phone}?text=${msg}`, '_blank');
      }
      toast.success(`${nomeMec} cadastrado!`);
    }
    setSavingStep2(false);
    setStep(3);
  }

  async function handleStep3(e: React.FormEvent) {
    e.preventDefault();
    setSavingStep3(true);
    if (servico.trim() && comissaoServico) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('regras_comissao').insert({
          user_id: user.id,
          servico,
          comissao: parseFloat(comissaoServico),
        });
        toast.success('Regra salva!');
      }
    }
    setSavingStep3(false);
    setStep(4);
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center pt-20 px-4">
      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-8 flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 -translate-y-1/2" />
        <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }} />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= i ? 'bg-primary text-white' : 'bg-white text-gray-400 border-2 border-gray-200'}`}>
            {step > i ? <CheckCircle2 size={24} /> : i}
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl">
        {step === 1 && (
          <Card className="border-t-4 border-t-primary shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Factory size={32} />
              </div>
              <CardTitle className="font-display text-3xl uppercase">Bem-vindo ao Torke</CardTitle>
              <CardDescription className="text-base text-gray-600">Vamos configurar sua oficina em 3 passos rápidos.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep1} className="space-y-4">
                <div className="space-y-2">
                  <Label>CNPJ <span className="text-gray-400 text-xs">(opcional)</span></Label>
                  <Input value={cnpj} onChange={e => setCnpj(e.target.value)} placeholder="00.000.000/0001-00" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone da Oficina <span className="text-gray-400 text-xs">(opcional)</span></Label>
                  <Input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 9999-9999" />
                </div>
                <Button type="submit" disabled={savingStep1} className="w-full bg-primary hover:bg-[#E55A15] text-white mt-6">
                  {savingStep1 ? 'Salvando...' : 'Próximo Passo'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-t-4 border-t-primary shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Users size={32} />
              </div>
              <CardTitle className="font-display text-3xl uppercase">Seu primeiro mecânico</CardTitle>
              <CardDescription className="text-base text-gray-600">Recomendamos cadastrar o seu melhor mecânico primeiro.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep2} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Mecânico <span className="text-gray-400 text-xs">(opcional)</span></Label>
                  <Input value={nomeMec} onChange={e => setNomeMec(e.target.value)} placeholder="Ex: Carlos" />
                </div>
                <div className="space-y-2">
                  <Label>Celular (WhatsApp)</Label>
                  <Input value={foneMec} onChange={e => setFoneMec(e.target.value)} placeholder="(11) 99999-9999" />
                  <p className="text-xs text-gray-500">Vamos enviar um convite para ele baixar o app.</p>
                </div>
                <div className="space-y-2">
                  <Label>Comissão Padrão (%)</Label>
                  <Input type="number" value={comissaoMec} onChange={e => setComissaoMec(e.target.value)} placeholder="Ex: 15" min="0" max="100" />
                </div>
                <Button type="submit" disabled={savingStep2} className="w-full bg-primary hover:bg-[#E55A15] text-white mt-6">
                  {savingStep2 ? 'Salvando...' : nomeMec ? 'Cadastrar e Continuar' : 'Pular'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-t-4 border-t-primary shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                <Percent size={32} />
              </div>
              <CardTitle className="font-display text-3xl uppercase">Regra Especial</CardTitle>
              <CardDescription className="text-base text-gray-600">Tem algum serviço que paga comissão diferente? <span className="text-primary font-medium">Opcional.</span></CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep3} className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="space-y-2 flex-1">
                    <Label>Tipo de Serviço</Label>
                    <Input value={servico} onChange={e => setServico(e.target.value)} placeholder="Ex: Alinhamento" />
                  </div>
                  <div className="space-y-2 w-32">
                    <Label>Comissão (%)</Label>
                    <Input type="number" value={comissaoServico} onChange={e => setComissaoServico(e.target.value)} placeholder="Ex: 30" min="0" max="100" />
                  </div>
                </div>
                <p className="text-xs text-gray-500">Você pode adicionar mais regras depois no painel.</p>
                <Button type="submit" disabled={savingStep3} className="w-full bg-primary hover:bg-[#E55A15] text-white mt-6">
                  {savingStep3 ? 'Salvando...' : servico ? 'Salvar e Continuar' : 'Pular'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="border-t-4 border-t-primary shadow-xl bg-secondary text-offwhite border-none">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-6">
                <Wrench size={40} />
              </div>
              <CardTitle className="font-display text-4xl uppercase text-white">Tudo Pronto!</CardTitle>
              <CardDescription className="text-lg text-gray-400">Sua oficina está configurada e pronta para voar.</CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-6">
              <Button size="lg" className="bg-primary hover:bg-white hover:text-black text-secondary font-bold text-xl uppercase px-8 h-16 w-full transition-all" onClick={() => navigate('/dashboard')}>
                Ir para o Painel
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

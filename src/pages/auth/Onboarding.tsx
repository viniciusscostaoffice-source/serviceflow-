import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { CheckCircle2, Factory, Users, Percent, Wrench } from 'lucide-react';

export function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => setStep(s => s + 1);
  const handleFinish = () => navigate('/dashboard');

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center pt-20 px-4">
      <div className="w-full max-w-2xl mb-8 flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
            step >= i ? 'bg-primary text-white' : 'bg-white text-gray-400 border-2 border-gray-200'
          }`}>
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
              <CardTitle className="font-display text-3xl uppercase">Bem-vindo ao ServiceFlow</CardTitle>
              <CardDescription className="text-base text-gray-600">Vamos configurar sua oficina para você parar de brigar por comissão.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>CNPJ (Opcional)</Label>
                <Input placeholder="00.000.000/0001-00" />
              </div>
              <div className="space-y-2">
                <Label>Telefone da Oficina</Label>
                <Input placeholder="(11) 9999-9999" />
              </div>
              <Button className="w-full bg-primary hover:bg-[#E55A15] text-white mt-6" onClick={handleNext}>
                Próximo Passo
              </Button>
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Mecânico</Label>
                <Input placeholder="Ex: Carlos" />
              </div>
              <div className="space-y-2">
                <Label>Celular (WhatsApp)</Label>
                <Input placeholder="(11) 99999-9999" />
                <p className="text-xs text-gray-500">Vamos enviar um convite para ele baixar o app.</p>
              </div>
              <div className="space-y-2">
                <Label>Comissão Padrão (%)</Label>
                <Input type="number" placeholder="Ex: 15" />
              </div>
              <Button className="w-full bg-primary hover:bg-[#E55A15] text-white mt-6" onClick={handleNext}>
                Cadastrar e Continuar
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
           <Card className="border-t-4 border-t-primary shadow-xl">
           <CardHeader className="text-center">
             <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
               <Percent size={32} />
             </div>
             <CardTitle className="font-display text-3xl uppercase">Regras Específicas</CardTitle>
             <CardDescription className="text-base text-gray-600">Tem algum serviço que paga comissão diferente?</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="flex gap-4 items-end">
               <div className="space-y-2 flex-1">
                 <Label>Tipo de Serviço</Label>
                 <Input placeholder="Ex: Alinhamento" />
               </div>
               <div className="space-y-2 w-32">
                 <Label>Comissão (%)</Label>
                 <Input type="number" placeholder="Ex: 30" />
               </div>
             </div>
             <p className="text-xs text-gray-500 mb-6">Você pode adicionar mais regras depois no painel.</p>
             <Button className="w-full bg-primary hover:bg-[#E55A15] text-white mt-6" onClick={handleNext}>
               Salvar Regras
             </Button>
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
              <Button size="lg" className="bg-primary hover:bg-white hover:text-black text-secondary font-bold text-xl uppercase px-8 h-16 w-full transition-all" onClick={handleFinish}>
                Ir para o Painel
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

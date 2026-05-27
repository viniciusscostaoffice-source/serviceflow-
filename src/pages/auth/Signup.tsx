import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Wrench, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Connect to Supabase Auth -> Insert user -> Insert oficina
    setTimeout(() => {
      toast.success('Conta criada com sucesso!');
      navigate('/onboarding');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <Wrench className="text-primary w-8 h-8" />
          <h2 className="font-display text-3xl tracking-widest uppercase text-secondary">
            Service<span className="text-primary">Flow</span>
          </h2>
        </Link>
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-2">
          Crie sua conta
        </h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-[#E55A15] transition-colors">
            Faça login aqui
          </Link>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 sm:rounded-xl sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="nome">Seu Nome (Dono/Gerente)</Label>
              <Input id="nome" required placeholder="João da Silva" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" required placeholder="seu@email.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oficina">Nome da Oficina</Label>
              <Input id="oficina" required placeholder="Auto Center Silva" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" required placeholder="São Paulo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input id="estado" required placeholder="SP" maxLength={2} />
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-[#E55A15] text-white font-bold uppercase tracking-wider mt-4" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Cadastrar e Começar'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

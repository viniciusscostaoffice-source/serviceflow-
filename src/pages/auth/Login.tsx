import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Wrench, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Connect to Supabase Auth
    setTimeout(() => {
      toast.success('Bem-vindo de volta!');
      navigate('/dashboard');
      setLoading(false);
    }, 1000);
    // TODO: após Supabase Auth, salvar nome da oficina no localStorage aqui
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <Wrench className="text-primary w-8 h-8" />
          <h2 className="font-display text-3xl tracking-widest uppercase text-secondary">
            Service<span className="text-primary">Flow</span>
          </h2>
        </Link>
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-2">
          Entrar no seu Painel
        </h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          Ou{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-[#E55A15] transition-colors">
            crie uma nova conta para sua oficina
          </Link>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="font-medium text-sm text-primary hover:text-[#E55A15]">
                  Esqueceu a senha?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-[#E55A15] text-white font-bold uppercase tracking-wider" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

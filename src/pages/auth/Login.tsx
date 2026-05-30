import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Wrench, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(
        error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : error.message
      );
      setLoading(false);
      return;
    }

    // Salvar dados no localStorage — compatível com login Google e email/senha
    const meta = data.user?.user_metadata ?? {};
    const nome = meta.nome ?? meta.full_name ?? meta.name ?? '';
    const oficina = meta.oficina ?? '';
    const avatar = meta.avatar_url ?? meta.picture ?? '';
    // Apenas dados de exibição — nunca user_id no localStorage
    if (nome) localStorage.setItem('sf_usuario', nome);
    if (oficina) localStorage.setItem('sf_oficina', oficina);
    if (avatar) localStorage.setItem('sf_avatar', avatar);
    if (data.user?.email) localStorage.setItem('sf_email', data.user.email);

    toast.success('Bem-vindo de volta!');
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo — painel escuro */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#FF6B1A 1px, transparent 1px), linear-gradient(90deg, #FF6B1A 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF6B1A] rounded-full opacity-10 blur-[120px] pointer-events-none" />

        <Link to="/" className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-[#FF6B1A] rounded-lg flex items-center justify-center">
            <Wrench size={22} className="text-white" />
          </div>
          <span className="font-display text-2xl tracking-widest uppercase text-white">
            Tor<span className="text-[#FF6B1A]">ke</span>
          </span>
        </Link>

        <div className="z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#FF6B1A]/10 border border-[#FF6B1A]/30 text-[#FF6B1A] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
            Gestão de Comissões para Oficinas
          </div>
          <h1 className="font-display text-5xl xl:text-6xl text-white uppercase leading-none">
            Controle<br />
            <span className="text-[#FF6B1A]">total</span> da<br />
            sua oficina.
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            Chega de brigar por comissão. Transparência total para você e seus mecânicos.
          </p>
        </div>

        <div className="z-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {['CS', 'PO', 'ZR'].map((ini) => (
              <div
                key={ini}
                className="w-8 h-8 rounded-full bg-[#FF6B1A]/20 border-2 border-[#0A0A0A] flex items-center justify-center text-[10px] font-bold text-[#FF6B1A]"
              >
                {ini}
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            <span className="text-white font-semibold">+200 oficinas</span> já usam o Torke
          </p>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-[#F5F5F0]">
        <Link to="/" className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-[#FF6B1A] rounded-lg flex items-center justify-center">
            <Wrench size={18} className="text-white" />
          </div>
          <span className="font-display text-2xl tracking-widest uppercase text-[#0A0A0A]">
            Tor<span className="text-[#FF6B1A]">ke</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0A0A0A] mb-2">Bem-vindo de volta</h2>
            <p className="text-gray-500 text-sm">
              Não tem conta?{' '}
              <Link to="/signup" className="text-[#FF6B1A] font-semibold hover:underline">
                Cadastre sua oficina
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#0A0A0A]" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white text-[#0A0A0A] placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF6B1A] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#0A0A0A]" htmlFor="password">
                  Senha
                </label>
                <Link to="/forgot-password" className="text-xs text-[#FF6B1A] hover:underline font-medium">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-12 px-4 pr-12 rounded-xl border-2 border-gray-200 bg-white text-[#0A0A0A] placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF6B1A] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 bg-[#FF6B1A] hover:bg-[#E55A15] disabled:opacity-60 text-white font-bold uppercase tracking-widest text-sm rounded-xl flex items-center justify-center gap-2 transition-colors mt-2 py-3.5"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" />Entrando...</>
              ) : (
                <>Entrar no Painel<ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">ou acesse como</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={() => { setEmail('demo@serviceflow.com.br'); setPassword('demo1234'); }}
            className="w-full h-12 border-2 border-gray-200 hover:border-[#0A0A0A] bg-white text-[#0A0A0A] font-semibold text-sm rounded-xl transition-colors"
          >
            Usar conta demo
          </button>
        </motion.div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench, Loader2, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';

export function Signup() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const nome    = (form.elements.namedItem('nome')     as HTMLInputElement).value.trim();
    const oficina = (form.elements.namedItem('oficina')  as HTMLInputElement).value.trim();
    const email   = (form.elements.namedItem('email')    as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const telefone = (form.elements.namedItem('telefone') as HTMLInputElement).value.replace(/\D/g, '');
    const cidade  = (form.elements.namedItem('cidade')   as HTMLInputElement).value.trim();
    const estado  = (form.elements.namedItem('estado')   as HTMLInputElement).value.trim().toUpperCase();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome, oficina, cidade, estado },
      },
    });

    if (error) {
      toast.error(
        error.message.includes('already registered')
          ? 'Este e-mail já está cadastrado. Faça login.'
          : error.message
      );
      setLoading(false);
      return;
    }

    // Salvar localmente para exibição imediata no dashboard
    localStorage.setItem('sf_usuario', nome);
    localStorage.setItem('sf_oficina', oficina);

    // Criar profile de billing (trial 7 dias) via Supabase
    if (data.user) {
      await supabase.from('profiles').upsert({
        user_id:             data.user.id,
        email,
        cellphone:           telefone || null,
        trial_ends_at:       new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        subscription_status: 'trial',
      }, { onConflict: 'user_id' });

      localStorage.setItem('sf_user_id', data.user.id);
    }

    // Se Supabase exige confirmação de e-mail, avisar o usuário
    if (!data.session) {
      toast.success('Conta criada! Verifique seu e-mail para confirmar o cadastro.');
      navigate('/login');
    } else {
      toast.success('Conta criada com sucesso! Bem-vindo ao ServiceFlow!');
      navigate('/onboarding');
    }

    setLoading(false);
  };

  const beneficios = [
    'Controle de comissões em tempo real',
    'App exclusivo para seus mecânicos',
    'Fechamento mensal automatizado',
    '7 dias grátis, sem cartão',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo */}
      <div className="hidden lg:flex lg:w-[42%] bg-[#0A0A0A] flex-col justify-between p-12 relative overflow-hidden shrink-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#FF6B1A 1px, transparent 1px), linear-gradient(90deg, #FF6B1A 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF6B1A] rounded-full opacity-10 blur-[120px] pointer-events-none" />

        <Link to="/" className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-[#FF6B1A] rounded-lg flex items-center justify-center">
            <Wrench size={22} className="text-white" />
          </div>
          <span className="font-display text-2xl tracking-widest uppercase text-white">
            Service<span className="text-[#FF6B1A]">Flow</span>
          </span>
        </Link>

        <div className="z-10 space-y-8">
          <div>
            <p className="text-[#FF6B1A] text-xs font-bold uppercase tracking-widest mb-3">Por que escolher o ServiceFlow?</p>
            <h2 className="font-display text-4xl xl:text-5xl text-white uppercase leading-none">
              Sua oficina<br />
              <span className="text-[#FF6B1A]">organizada</span><br />
              de verdade.
            </h2>
          </div>
          <ul className="space-y-3">
            {beneficios.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#FF6B1A] mt-0.5 shrink-0" />
                <span className="text-gray-300 text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="z-10 bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-gray-300 text-sm italic leading-relaxed">
            "Antes eu perdia horas calculando comissão na planilha. Agora é tudo automático e meus mecânicos confiam nos números."
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-9 h-9 rounded-full bg-[#FF6B1A]/20 flex items-center justify-center text-xs font-bold text-[#FF6B1A]">MR</div>
            <div>
              <p className="text-white text-xs font-semibold">Marcos Ribeiro</p>
              <p className="text-gray-500 text-xs">Dono — Auto Mecânica Ribeiro, SP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-[#F5F5F0] overflow-y-auto">
        <Link to="/" className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-[#FF6B1A] rounded-lg flex items-center justify-center">
            <Wrench size={18} className="text-white" />
          </div>
          <span className="font-display text-2xl tracking-widest uppercase text-[#0A0A0A]">
            Service<span className="text-[#FF6B1A]">Flow</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-7">
            <h2 className="text-3xl font-bold text-[#0A0A0A] mb-1.5">Crie sua conta grátis</h2>
            <p className="text-gray-500 text-sm">
              Já tem conta?{' '}
              <Link to="/login" className="text-[#FF6B1A] font-semibold hover:underline">Faça login aqui</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0A0A0A] uppercase tracking-wide" htmlFor="nome">Seu Nome</label>
                <input id="nome" name="nome" required placeholder="João Silva"
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white text-[#0A0A0A] placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF6B1A] transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0A0A0A] uppercase tracking-wide" htmlFor="oficina">Nome da Oficina</label>
                <input id="oficina" name="oficina" required placeholder="Auto Center Silva"
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white text-[#0A0A0A] placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF6B1A] transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0A0A0A] uppercase tracking-wide" htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" required placeholder="seu@email.com"
                className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white text-[#0A0A0A] placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF6B1A] transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0A0A0A] uppercase tracking-wide" htmlFor="telefone">WhatsApp / Telefone</label>
              <input id="telefone" name="telefone" type="tel" required placeholder="(99) 99999-9999"
                className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white text-[#0A0A0A] placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF6B1A] transition-colors" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0A0A0A] uppercase tracking-wide" htmlFor="password">Senha</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} required
                  placeholder="Mínimo 6 caracteres" minLength={6}
                  className="w-full h-12 px-4 pr-12 rounded-xl border-2 border-gray-200 bg-white text-[#0A0A0A] placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF6B1A] transition-colors" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-[#0A0A0A] uppercase tracking-wide" htmlFor="cidade">Cidade</label>
                <input id="cidade" name="cidade" required placeholder="São Paulo"
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white text-[#0A0A0A] placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF6B1A] transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0A0A0A] uppercase tracking-wide" htmlFor="estado">UF</label>
                <input id="estado" name="estado" required placeholder="SP" maxLength={2}
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white text-[#0A0A0A] placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF6B1A] transition-colors uppercase" />
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Ao cadastrar, você concorda com nossos{' '}
              <a href="#" className="text-[#FF6B1A] hover:underline">Termos de Uso</a> e{' '}
              <a href="#" className="text-[#FF6B1A] hover:underline">Política de Privacidade</a>.
            </p>

            <button type="submit" disabled={loading}
              className="w-full bg-[#FF6B1A] hover:bg-[#E55A15] disabled:opacity-60 text-white font-bold uppercase tracking-widest text-sm rounded-xl flex items-center justify-center gap-2 transition-colors py-3.5">
              {loading ? (
                <><Loader2 size={18} className="animate-spin" />Criando sua conta...</>
              ) : (
                <>Começar grátis — 7 dias<ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

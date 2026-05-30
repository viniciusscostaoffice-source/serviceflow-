import { ArrowRight, ShieldCheck, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ScrollReveal';

export function FinalCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-secondary border-t-8 border-black texture-bg relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none diagonal-lines" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <ScrollReveal direction="up" duration={600}>
          <p className="inline-flex items-center gap-2 bg-black/10 border border-black/20 px-4 py-2 text-xs font-bold uppercase tracking-widest">
            <Star size={12} className="fill-current" />
            Mais de 200 oficinas já usam
            <Star size={12} className="fill-current" />
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={600}>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-none drop-shadow-sm">
            Chega de perder<br />
            <span className="underline decoration-4 underline-offset-4">mecânico bom por bobagem.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} duration={600}>
          <p className="text-xl sm:text-2xl font-medium text-black/80 max-w-2xl mx-auto leading-relaxed">
            Transparência retém profissional bom. Profissional bom retém cliente bom. Tudo começa em mostrar o número certo, na hora certa.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={350} duration={700}>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex w-full sm:w-auto px-10 py-6 bg-secondary text-offwhite font-display text-2xl sm:text-3xl hover:bg-white hover:text-black transition-colors duration-300 items-center justify-center gap-3 uppercase cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            >
              COMEÇAR GRÁTIS — 7 DIAS
              <ArrowRight size={28} />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="none" delay={500} duration={600}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
            <span className="flex items-center gap-2 text-sm text-black/70 font-medium">
              <ShieldCheck size={16} />
              Sem cartão de crédito agora
            </span>
            <span className="hidden sm:block text-black/30">•</span>
            <span className="flex items-center gap-2 text-sm text-black/70 font-medium">
              <Clock size={16} />
              Configurado em menos de 10 minutos
            </span>
            <span className="hidden sm:block text-black/30">•</span>
            <span className="flex items-center gap-2 text-sm text-black/70 font-medium">
              <ShieldCheck size={16} />
              Garantia de 30 dias
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

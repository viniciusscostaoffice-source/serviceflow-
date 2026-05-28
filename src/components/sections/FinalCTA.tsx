import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';
import { checkoutUrl } from '../../config/env';

export function FinalCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-secondary border-t-8 border-black texture-bg relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none diagonal-lines" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
        <ScrollReveal direction="up" duration={600}>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase shadow-black drop-shadow-sm">
            50 vagas. Quando acabar, acabou.
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150} duration={600}>
          <p className="text-xl sm:text-2xl font-medium text-black max-w-2xl mx-auto">
            Depois do lançamento, o plano normal para novos assinantes vai ser R$ 89/mês.
            Garante seu R$ 49 vitalício agora.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={300} duration={700}>
          <div className="pt-6">
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto px-8 py-5 bg-secondary text-offwhite font-display text-2xl sm:text-3xl hover:bg-white hover:text-black transition-colors duration-300 items-center justify-center gap-3 uppercase cursor-pointer"
            >
              QUERO MINHA VAGA — R$ 49
              <ArrowRight size={28} />
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="none" delay={500} duration={600}>
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-black/10 rounded-full font-bold uppercase tracking-wider text-black">
            <span className="text-xl animate-pulse">🔥</span> Restam 47 vagas de 50
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

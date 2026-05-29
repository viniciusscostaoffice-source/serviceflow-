import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ScrollReveal';

export function FinalCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-secondary border-t-8 border-black texture-bg relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none diagonal-lines" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
        <ScrollReveal direction="up" duration={600}>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase shadow-black drop-shadow-sm">
            Chega de briga por comissão.
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150} duration={600}>
          <p className="text-xl sm:text-2xl font-medium text-black max-w-2xl mx-auto">
            Comece grátis por 7 dias. Sem cartão agora. Cancele quando quiser.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={300} duration={700}>
          <div className="pt-6">
            <Link
              to="/signup"
              className="inline-flex w-full sm:w-auto px-8 py-5 bg-secondary text-offwhite font-display text-2xl sm:text-3xl hover:bg-white hover:text-black transition-colors duration-300 items-center justify-center gap-3 uppercase cursor-pointer"
            >
              COMEÇAR GRÁTIS — 7 DIAS
              <ArrowRight size={28} />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="none" delay={500} duration={600}>
          <p className="text-sm text-black/60 font-medium">
            🔒 Sem cobrança nos primeiros 7 dias. Garantia incondicional de 30 dias.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

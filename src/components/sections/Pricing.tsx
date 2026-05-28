import { Check, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';
import { checkoutUrl } from '../../config/env';

export function Pricing() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary text-offwhite texture-bg">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white">
              PRÉ-VENDA COM <span className="text-primary">50% VITALÍCIO</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} duration={800}>
          <div className="max-w-md mx-auto">
            <div className="relative bg-[#1A1A1A] border-4 border-primary p-8 sm:p-10 shadow-[0_0_40px_rgba(255,107,26,0.15)]">
              <div className="absolute top-0 right-0 bg-primary text-secondary font-bold text-xs uppercase px-3 py-1 -mt-4 mr-4">
                Mais popular
              </div>

              <h3 className="font-display text-3xl mb-2 text-white">PLANO OFICINA</h3>

              <div className="mb-6 flex flex-col items-start justify-start">
                <span className="text-gray-500 line-through text-lg mt-2">R$ 89/mês</span>
                <div className="flex items-end gap-2">
                  <span className="font-display text-6xl text-primary leading-none">R$ 49</span>
                  <span className="text-gray-400 mb-1">/mês</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">Para sempre. Enquanto for cliente, paga R$ 49.</p>
              </div>

              <div className="space-y-4 mb-10">
                {[
                  "Painel web pro gerente",
                  "App mobile pro mecânico",
                  "Até 8 mecânicos cadastrados",
                  "Histórico ilimitado",
                  "Suporte por WhatsApp",
                  "Atualizações grátis pra sempre",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check size={20} className="text-primary flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center px-6 py-5 bg-primary text-secondary font-display text-2xl hover:bg-white transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer mb-4"
              >
                GARANTIR MINHA VAGA AGORA
                <ArrowRight size={24} />
              </a>

              <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1.5 flex-wrap">
                <span className="inline-block text-gray-400">🔒</span> Pagamento único de R$ 49 reserva sua vaga.
                <br className="hidden sm:block" /> Entrega em 60 dias. Garantia de 30 dias após receber.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

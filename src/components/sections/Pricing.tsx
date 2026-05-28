import { Check, ArrowRight, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../ScrollReveal';

const plans = [
  {
    name: 'BÁSICO',
    price: 59,
    description: 'Pra oficina que quer começar com o pé direito',
    highlight: false,
    badge: null,
    features: [
      'Painel web pro gerente',
      'App mobile pro mecânico',
      'Até 5 mecânicos cadastrados',
      'Histórico ilimitado',
      'Suporte por WhatsApp',
      'Atualizações grátis',
    ],
    cta: 'COMEÇAR GRÁTIS',
  },
  {
    name: 'PROFISSIONAL',
    price: 80,
    description: 'O mais escolhido pelos donos de oficina',
    highlight: true,
    badge: 'Mais popular',
    features: [
      'Painel web pro gerente',
      'App mobile pro mecânico',
      'Até 7 mecânicos cadastrados',
      'Histórico ilimitado',
      'Suporte prioritário por WhatsApp',
      'Atualizações grátis pra sempre',
      'Relatório mensal de comissões',
    ],
    cta: 'COMEÇAR GRÁTIS',
  },
  {
    name: 'PREMIUM',
    price: 120,
    description: 'Pra oficina que não quer limite de crescimento',
    highlight: false,
    badge: null,
    features: [
      'Painel web pro gerente',
      'App mobile pro mecânico',
      'Mecânicos ilimitados',
      'Histórico ilimitado',
      'Suporte VIP por WhatsApp',
      'Atualizações grátis pra sempre',
      'Relatório mensal de comissões',
      'Onboarding personalizado',
    ],
    cta: 'COMEÇAR GRÁTIS',
  },
];

export function Pricing() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary text-offwhite texture-bg">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center mb-4">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white">
              ESCOLHA SEU <span className="text-primary">PLANO</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={600}>
          <div className="flex items-center justify-center gap-2 mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/30 rounded-full">
              <Gift size={18} className="text-primary" />
              <span className="text-primary font-bold text-sm uppercase tracking-wider">7 dias grátis em todos os planos — sem cartão agora</span>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, index) => (
            <ScrollReveal key={plan.name} direction="up" delay={index * 150} duration={700}>
              <div
                className={`relative flex flex-col h-full ${
                  plan.highlight
                    ? 'bg-[#1A1A1A] border-4 border-primary shadow-[0_0_40px_rgba(255,107,26,0.2)]'
                    : 'bg-[#141414] border border-gray-700'
                }`}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-primary text-secondary font-bold text-xs uppercase px-3 py-1 -mt-4 mr-4">
                    {plan.badge}
                  </div>
                )}

                <div className="p-8 sm:p-10 flex flex-col flex-1">
                  <h3 className="font-display text-2xl mb-1 text-white">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

                  <div className="mb-2">
                    <div className="flex items-end gap-2">
                      <span className="font-display text-5xl text-primary leading-none">R$ {plan.price}</span>
                      <span className="text-gray-400 mb-1">/mês</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">após os 7 dias grátis</p>
                  </div>

                  <div className="my-5 py-2 px-3 bg-primary/10 border-l-2 border-primary text-primary text-xs font-bold uppercase tracking-wide">
                    🎁 7 dias grátis — cancele antes, não paga nada
                  </div>

                  <div className="space-y-3 mb-10 flex-1">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check
                          size={18}
                          className={`flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-primary' : 'text-gray-400'}`}
                        />
                        <span className="text-gray-300 text-sm leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/signup"
                    className={`w-full block text-center px-6 py-4 font-display text-lg transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      plan.highlight
                        ? 'bg-primary text-secondary hover:bg-white hover:text-black'
                        : 'bg-gray-800 text-white hover:bg-primary hover:text-secondary border border-gray-600'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={500} duration={600}>
          <p className="text-center text-xs text-gray-600 mt-10">
            🔒 Sem cobrança nos primeiros 7 dias. Cancele quando quiser. Garantia incondicional de 30 dias.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

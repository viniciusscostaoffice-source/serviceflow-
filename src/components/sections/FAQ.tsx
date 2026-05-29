import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';

const faqs = [
  {
    q: "Os 7 dias grátis são de verdade? Preciso colocar cartão?",
    a: "Sim, são de verdade. Você informa o cartão no cadastro, mas não é cobrado nada nos primeiros 7 dias. Se cancelar antes, não paga absolutamente nada."
  },
  {
    q: "Qual plano eu devo escolher?",
    a: "Depende do tamanho da sua equipe. Até 3 mecânicos: Básico (R$ 59/mês). Até 10: Profissional (R$ 80/mês). Equipe maior ou quer suporte VIP e onboarding: Premium (R$ 120/mês). Todos têm os 7 dias grátis."
  },
  {
    q: "Preciso trocar meu sistema atual?",
    a: "Não. O ServiceFlow Oficina trabalha junto com qualquer ERP que você já usa. É focado exclusivamente na gestão de comissões dos mecânicos."
  },
  {
    q: "E se eu não gostar após os 7 dias?",
    a: "Garantia incondicional de 30 dias após o início da cobrança. Se não resolver seu problema, devolvemos 100% e continuamos amigos."
  },
  {
    q: "Funciona em quantas oficinas?",
    a: "Uma assinatura vale para uma oficina (um CNPJ). Tem mais de uma unidade? Fala com a gente pelo WhatsApp que ajustamos."
  },
  {
    q: "Mecânico precisa de celular caro?",
    a: "Não. O app foi feito para ser leve. Funciona em qualquer smartphone Android ou iPhone, mesmo os modelos mais básicos."
  },
  {
    q: "Posso mudar de plano depois?",
    a: "Sim. Você pode fazer upgrade ou downgrade do plano a qualquer momento direto pelo painel, sem burocracia."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-offwhite text-secondary">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-secondary">
              Perguntas que todo dono faz
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal key={index} direction="up" delay={index * 60} duration={500}>
                <div className="border border-gray-300 bg-white">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-display text-xl text-secondary">{faq.q}</span>
                    <ChevronDown
                      size={24}
                      className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';

const faqs = [
  {
    q: "Os 7 dias grátis são de verdade? Preciso colocar cartão?",
    a: "São de verdade e você não precisa colocar cartão pra começar. É só criar a conta e usar. Se gostar, escolhe um plano depois dos 7 dias. Se não, não paga nada e nem precisa cancelar."
  },
  {
    q: "Qual plano eu devo escolher?",
    a: "Depende do tamanho da sua equipe. Até 3 mecânicos: Básico (R$ 59/mês). Até 10: Profissional (R$ 80/mês). Equipe maior ou quer suporte VIP e onboarding: Premium (R$ 120/mês). Todos têm os 7 dias grátis."
  },
  {
    q: "Preciso trocar meu sistema atual?",
    a: "Não. O Torke Oficina trabalha junto com qualquer ERP que você já usa. É focado exclusivamente na gestão de comissões dos mecânicos."
  },
  {
    q: "E se eu não gostar após os 7 dias?",
    a: "Sem problema e sem pegadinha. Você só vira assinante se escolher um plano por conta própria. Se não gostar, é só não assinar — você não paga nada e não fica preso a nada."
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
                <div className={`border bg-white transition-colors duration-300 ${isOpen ? 'border-primary shadow-[0_0_0_1px_rgba(255,107,26,0.4)]' : 'border-gray-300'}`}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-primary/5 transition-colors gap-4"
                  >
                    <span className={`font-display text-xl transition-colors ${isOpen ? 'text-primary' : 'text-secondary'}`}>{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.15 : 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-primary flex-shrink-0"
                    >
                      <ChevronDown size={24} />
                    </motion.div>
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

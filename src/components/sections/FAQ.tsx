import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "Quando vou receber o sistema?",
    a: "Entrega prevista pra 60 dias após o pagamento. Você acompanha o progresso por WhatsApp, direto com os fundadores."
  },
  {
    q: "Preciso trocar meu sistema atual?",
    a: "Não. O ServiceFlow Oficina trabalha junto com qualquer ERP que você já usa. É focado exclusivamente na gestão de comissões."
  },
  {
    q: "E se eu não gostar?",
    a: "Garantia incondicional de 30 dias após receber o acesso. Se não resolver seu problema, devolvemos os R$ 49 e continuamos amigos."
  },
  {
    q: "Funciona em quantas oficinas?",
    a: "Uma assinatura vale para uma oficina (um CNPJ). Tem mais de uma unidade? Fala com a gente pelo WhatsApp que ajustamos."
  },
  {
    q: "Mecânico precisa de celular caro?",
    a: "Não. O App foi feito para ser leve. Funciona em qualquer smartphone Android ou iPhone, mesmo os modelos mais básicos."
  },
  {
    q: "Esses R$ 49 valem pra sempre?",
    a: "Sim. Enquanto você mantiver a assinatura ativa, pagará sempre R$ 49/mês. Este é um benefício vitalício exclusivo pros 50 primeiros clientes fundadores."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-offwhite text-secondary">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-secondary">
            Perguntas que todo dono faz
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border border-gray-300 bg-white"
              >
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
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                     >
                       <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed">
                         {faq.a}
                       </div>
                     </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

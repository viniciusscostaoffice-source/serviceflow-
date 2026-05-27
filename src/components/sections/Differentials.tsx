import { motion } from 'motion/react';
import { Smartphone, History, MessageSquareWarning, Blocks } from 'lucide-react';

const diffs = [
  {
    icon: Smartphone,
    title: "App do Mecânico no bolso",
    description: "Único sistema do Brasil que dá app separado pro mecânico ver comissão em tempo real."
  },
  {
    icon: History,
    title: "Edição com rastro",
    description: "Toda alteração fica registrada. Acabou desconfiança. O histórico prova tudo."
  },
  {
    icon: MessageSquareWarning,
    title: "Botão 'Discordo'",
    description: "Mecânico pode contestar lançamento direto no app. Resolve treta antes de virar problema."
  },
  {
    icon: Blocks,
    title: "Você continua com seu sistema atual",
    description: "Não precisa trocar de ERP. Funciona como um complemento perfeito pro que você já usa."
  }
];

export function Differentials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-secondary relative overflow-hidden">
      {/* Background diagonal lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{
             backgroundImage: 'repeating-linear-gradient(45deg, #0A0A0A 0, #0A0A0A 2px, transparent 2px, transparent 12px)'
           }}>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase">
            Por que ServiceFlow Oficina é diferente
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {diffs.map((diff, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-secondary text-offwhite p-8 md:p-10 border-2 border-transparent hover:border-black transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary text-secondary">
                  <diff.icon size={28} />
                </div>
                <h3 className="font-display text-2xl m-0 leading-tight">{diff.title}</h3>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                {diff.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

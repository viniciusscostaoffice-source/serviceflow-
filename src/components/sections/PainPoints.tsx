import { Flame, FileSpreadsheet, UserMinus } from 'lucide-react';
import { motion } from 'motion/react';
import { ScrollReveal } from '../ScrollReveal';

const painPoints = [
  {
    icon: Flame,
    title: "Todo dia 30 vira uma bomba",
    description: "Mecânico chega com a conta dele, você chega com a sua. Os números não batem. A discussão começa. O mês termina mal — de novo."
  },
  {
    icon: FileSpreadsheet,
    title: "A planilha que só você entende",
    description: "Fórmula quebrada, coluna errada, versão antiga salva por cima da certa. Um dia você vai perder dados de um mês inteiro."
  },
  {
    icon: UserMinus,
    title: "Seu melhor mecânico já está de olho em outra oficina",
    description: "Profissional bom não aguenta trabalhar no escuro. Se ele não confia no que vai receber, vai embora — e leva a clientela junto."
  }
];

export function PainPoints() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-offwhite text-secondary">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-secondary">
              Se você tem oficina, já viveu isso.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 150} duration={600}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                className="bg-white p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:border-red-200 transition-[box-shadow,border-color] duration-300 h-full group"
              >
                <motion.div
                  className="w-14 h-14 bg-red-100 flex items-center justify-center rounded-lg mb-6 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.1, rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <point.icon size={32} />
                </motion.div>
                <h3 className="font-display text-2xl mb-4 text-secondary">{point.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {point.description}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

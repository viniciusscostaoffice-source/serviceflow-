import { Smartphone, History, FileText, Blocks } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { ScrollReveal } from '../ScrollReveal';

const diffs = [
  {
    icon: Smartphone,
    title: "O mecânico vê tudo no celular — sem precisar perguntar",
    description: "App próprio pro mecânico: ele abre, vê cada OS, vê o valor da comissão, vê o total do mês. A dúvida some antes de virar briga."
  },
  {
    icon: History,
    title: "Qualquer alteração fica registrada para sempre",
    description: "Mudou um valor? Corrigiu uma OS? O sistema guarda quem fez, quando fez e o que era antes. Ninguém pode dizer que foi manipulado."
  },
  {
    icon: FileText,
    title: "Fechamento em um clique, PDF na mão",
    description: "No fim do mês, gere o relatório de comissões por mecânico em segundos. Assina, entrega, acabou. Sem retrabalho."
  },
  {
    icon: Blocks,
    title: "Funciona junto com o que você já usa",
    description: "Não precisa trocar de sistema. O Torke entra como um complemento — você lança as OSs aqui e continua com seu ERP normalmente."
  }
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [5, -5]);
  const rotateY = useTransform(x, [-60, 60], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Differentials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-secondary relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #0A0A0A 0, #0A0A0A 2px, transparent 2px, transparent 12px)' }}
      />

      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-black/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase">
              Feito para oficina. Não adaptado.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {diffs.map((diff, index) => (
            <ScrollReveal key={index} direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 100} duration={700} distance="60px">
              <TiltCard className="bg-secondary text-offwhite p-8 md:p-10 h-full relative overflow-hidden group cursor-default border-2 border-transparent hover:border-black/40 transition-colors duration-300">
                {/* Shine on hover */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />

                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-3 bg-primary text-secondary flex-shrink-0"
                  >
                    <diff.icon size={28} />
                  </motion.div>
                  <h3 className="font-display text-xl md:text-2xl m-0 leading-tight">{diff.title}</h3>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">{diff.description}</p>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

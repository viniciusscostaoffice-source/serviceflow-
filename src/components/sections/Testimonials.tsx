import { useRef, useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ScrollReveal } from '../ScrollReveal';

const testimonials = [
  {
    name: "Rodrigo Alves",
    role: "Dono — Alves Auto Center",
    city: "São Paulo, SP",
    avatar: "RA",
    stars: 5,
    text: "Antes do Torke, todo dia 30 era uma guerra. Meu melhor mecânico chegou a ameaçar ir embora por causa de R$80 de diferença no cálculo. Hoje ele mesmo confere tudo no celular e nunca mais discutimos sobre comissão.",
  },
  {
    name: "Claudinho Ferreira",
    role: "Mecânico — 11 anos de profissão",
    city: "Campinas, SP",
    avatar: "CF",
    stars: 5,
    text: "Eu ficava com aquela pulga atrás da orelha o mês todo. Será que tão me passando pra trás? Agora vejo cada OS que fecho no celular na hora. Confio no dono, o dono confia em mim. É outra relação.",
  },
  {
    name: "Marcos Teixeira",
    role: "Proprietário — Teixeira Mecânica",
    city: "Belo Horizonte, MG",
    avatar: "MT",
    stars: 5,
    text: "Perdi dois mecânicos bons em 2023 por causa de briga de comissão. Implantei o Torke e em 3 meses a equipe estabilizou. O retorno foi mais do que o custo da ferramenta no primeiro mês.",
  },
  {
    name: "Paulo Henrique Costa",
    role: "Sócio-gerente — PHC Service",
    city: "Curitiba, PR",
    avatar: "PC",
    stars: 5,
    text: "Tentei planilha, tentei anotar no caderno, tentei app genérico. Nada funcionava porque nenhum era feito pra oficina. O Torke é diferente: foi feito pra esse problema específico e resolve de vez.",
  },
];

const stats = [
  { value: 87, suffix: '%', label: "das oficinas eliminaram brigas de comissão no 1º mês" },
  { value: 3, suffix: 'x', label: "mais rápido fechar a folha no fim do mês" },
  { value: 0, prefix: 'R$ ', label: "de perda por erro de cálculo após implantação" },
  { value: 94, suffix: '%', label: "dos mecânicos aprovam a transparência do sistema" },
];

// Counter animado
function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1800, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(() => {
    return spring.on('change', (v) => setDisplay(Math.round(v)));
  }, [spring]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

// Card com efeito 3D tilt no hover
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [6, -6]);
  const rotateY = useTransform(x, [-60, 60], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary text-offwhite overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Stats strip com counters animados */}
        <ScrollReveal direction="up" duration={600}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-primary/20 border border-primary/20 mb-20">
            {stats.map((stat, i) => (
              <div key={i} className="bg-secondary px-6 py-8 text-center group hover:bg-primary/5 transition-colors duration-300">
                <p className="font-display text-4xl sm:text-5xl text-primary mb-2 tabular-nums">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-gray-400 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" duration={600}>
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase">
              Quem já parou de brigar
            </h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto">
              Donos de oficina e mecânicos que viraram a chave.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((t, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 120} duration={600}>
              <TiltCard className="bg-[#111] border border-gray-800 p-8 flex flex-col gap-6 h-full hover:border-primary/40 transition-colors cursor-default">
                {/* Stars com entrada em cascata */}
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -30 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.06, type: 'spring', stiffness: 400 }}
                    >
                      <Star size={16} className="fill-primary text-primary" />
                    </motion.span>
                  ))}
                </div>

                {/* Quote */}
                <div className="relative flex-1">
                  <Quote size={24} className="text-primary/30 absolute -top-1 -left-1" />
                  <p className="text-gray-300 text-lg leading-relaxed pl-6">{t.text}</p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 pt-2 border-t border-gray-800">
                  <motion.div
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                    className="w-11 h-11 bg-primary text-secondary font-display text-sm flex items-center justify-center flex-shrink-0"
                  >
                    {t.avatar}
                  </motion.div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role} · {t.city}</p>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}

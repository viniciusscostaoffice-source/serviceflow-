import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
  onOpenModal: () => void;
}

// Partículas flutuantes no background
function Particles() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 5,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
          animate={{ y: [0, -30, 0], opacity: [p.opacity, p.opacity * 2, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// Texto com reveal palavra por palavra
function WordReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </span>
  );
}

export function Hero({ onOpenModal }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const yContent = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-secondary text-offwhite"
    >
      {/* Parallax background glow */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: yBg }}>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 right-1/4 w-[250px] h-[250px] bg-orange-500/5 rounded-full blur-[80px]" />
      </motion.div>

      {/* Linhas diagonais */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
        <div className="w-[150%] h-[1px] bg-primary -rotate-45" />
        <div className="absolute w-[150%] h-[1px] bg-primary -rotate-45 translate-y-24" />
        <div className="absolute w-[150%] h-[1px] bg-primary -rotate-45 -translate-y-24" />
        <div className="absolute w-[150%] h-[1px] bg-primary -rotate-45 translate-y-48" />
        <div className="absolute w-[150%] h-[1px] bg-primary -rotate-45 -translate-y-48" />
      </div>

      {/* Grid sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,107,26,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,26,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
      />

      <Particles />

      {/* Conteúdo com parallax */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center space-y-8"
        style={{ y: yContent, opacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(6px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/60 text-primary rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mx-auto"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Wrench size={14} />
          </motion.span>
          Gestão de comissões para oficinas
          {/* Pulse dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        </motion.div>

        {/* Headline com word reveal */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-none tracking-tight">
          <WordReveal text="SEU MECÂNICO" delay={0.1} />
          <br />
          <WordReveal
            text="JÁ SABE QUANTO VAI RECEBER."
            className="text-primary"
            delay={0.3}
          />
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
        >
          Cada OS fechada aparece no celular dele na hora, com o valor da comissão calculado.
          Sem surpresa no fim do mês. Sem briga. Sem mecânico bom indo embora.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/signup"
              className="relative w-full sm:w-auto px-8 py-5 bg-primary text-secondary font-display text-xl sm:text-2xl flex items-center justify-center gap-3 uppercase cursor-pointer overflow-hidden group shadow-[0_0_30px_rgba(255,107,26,0.4)]"
            >
              {/* Shine sweep */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              COMEÇAR GRÁTIS — 7 DIAS
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight size={24} />
              </motion.span>
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenModal}
            className="w-full sm:w-auto px-8 py-5 bg-transparent border-2 border-offwhite/60 text-offwhite font-display text-xl sm:text-2xl hover:border-primary hover:text-primary transition-colors duration-300 uppercase cursor-pointer"
          >
            Ver como funciona
          </motion.button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500"
        >
          <span className="font-medium">7 dias grátis, sem cartão.</span>
          <span className="hidden sm:block text-gray-700">|</span>
          <span className="flex items-center gap-2">
            <span className="flex -space-x-2">
              {['RA', 'CF', 'MT', 'PC'].map((init, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + i * 0.1, type: 'spring', stiffness: 300 }}
                  className="w-7 h-7 rounded-full bg-primary text-secondary text-xs font-display flex items-center justify-center border-2 border-secondary"
                >
                  {init}
                </motion.span>
              ))}
            </span>
            <span className="text-gray-400">+200 oficinas já usam</span>
          </span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ opacity }}
      >
        <span className="text-xs text-gray-600 uppercase tracking-widest">scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-primary to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

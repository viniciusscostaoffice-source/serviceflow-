import { ArrowRight, ShieldCheck, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ScrollReveal } from '../ScrollReveal';

const floatingParticles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 4,
}));

export function FinalCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-secondary border-t-8 border-black relative overflow-hidden">
      {/* Diagonal lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #000 0, #000 1px, transparent 1px, transparent 12px)' }}
      />

      {/* Radial glow center */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-black/15 rounded-full blur-[80px]" />
      </div>

      {/* Floating dark particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-black/20"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <ScrollReveal direction="up" duration={600}>
          <p className="inline-flex items-center gap-2 bg-black/10 border border-black/20 px-4 py-2 text-xs font-bold uppercase tracking-widest">
            <Star size={12} className="fill-current" />
            Mais de 200 oficinas já usam
            <Star size={12} className="fill-current" />
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} duration={600}>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl uppercase leading-none drop-shadow-sm">
            Chega de perder<br />
            <motion.span
              className="inline-block underline decoration-4 underline-offset-4"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              mecânico bom por bobagem.
            </motion.span>
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} duration={600}>
          <p className="text-xl sm:text-2xl font-medium text-black/80 max-w-2xl mx-auto leading-relaxed">
            Transparência retém profissional bom. Profissional bom retém cliente bom. Tudo começa em mostrar o número certo, na hora certa.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={350} duration={700}>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/signup"
                className="relative inline-flex w-full sm:w-auto px-10 py-6 bg-secondary text-offwhite font-display text-2xl sm:text-3xl items-center justify-center gap-3 uppercase cursor-pointer shadow-[0_8px_40px_rgba(0,0,0,0.35)] overflow-hidden group"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                COMEÇAR GRÁTIS — 7 DIAS
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight size={28} />
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="none" delay={500} duration={600}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-2">
            {[
              { icon: ShieldCheck, text: 'Sem cartão de crédito' },
              { icon: Clock, text: 'Configurado em menos de 10 minutos' },
              { icon: ShieldCheck, text: 'Cancele quando quiser' },
            ].map(({ icon: Icon, text }, i) => (
              <motion.span
                key={i}
                className="flex items-center gap-2 text-sm text-black/70 font-medium"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <Icon size={16} />
                {text}
                {i < 2 && <span className="hidden sm:inline text-black/30 ml-6">•</span>}
              </motion.span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

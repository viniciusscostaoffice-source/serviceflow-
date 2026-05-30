import { motion } from 'motion/react';
import { ArrowRight, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { checkoutUrl } from '../../config/env';

interface HeroProps {
  onOpenModal: () => void;
}

export function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 texture-bg overflow-hidden bg-secondary text-offwhite border-b border-primary/20">
      {/* Dynamic diagonal background line */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[150%] h-[2px] bg-primary -rotate-45 transform origin-center"></div>
        <div className="absolute w-[150%] h-[2px] bg-primary -rotate-45 transform origin-center translate-y-24"></div>
        <div className="absolute w-[150%] h-[2px] bg-primary -rotate-45 transform origin-center -translate-y-24"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary text-primary rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mx-auto"
        >
          <Wrench size={16} />
          Gestão de comissões para oficinas
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-none tracking-tight"
        >
          SEU MECÂNICO<br />
          <span className="text-primary">JÁ SABE QUANTO VAI RECEBER.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
        >
          Cada OS fechada aparece no celular dele na hora, com o valor da comissão calculado.
          Sem surpresa no fim do mês. Sem briga. Sem mecânico bom indo embora.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-5 bg-primary text-secondary font-display text-xl sm:text-2xl hover:bg-white hover:text-secondary transition-colors duration-300 flex items-center justify-center gap-3 uppercase cursor-pointer shadow-[0_0_20px_rgba(255,107,26,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            COMEÇAR GRÁTIS — 7 DIAS
            <ArrowRight size={24} />
          </Link>
          <button
            onClick={onOpenModal}
            className="w-full sm:w-auto px-8 py-5 bg-transparent border-2 border-offwhite text-offwhite font-display text-xl sm:text-2xl hover:bg-offwhite hover:text-secondary transition-colors duration-300 uppercase cursor-pointer"
          >
            Ver como funciona
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-gray-500"
        >
          <span className="font-medium">7 dias grátis, sem cartão.</span>
          <span className="hidden sm:block text-gray-700">|</span>
          <span className="flex items-center gap-2">
            <span className="flex -space-x-2">
              {['RA','CF','MT','PC'].map((init, i) => (
                <span key={i} className="w-7 h-7 rounded-full bg-primary text-secondary text-xs font-display flex items-center justify-center border-2 border-secondary">{init}</span>
              ))}
            </span>
            <span className="text-gray-400">+200 oficinas já usam</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}

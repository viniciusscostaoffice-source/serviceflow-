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
      {/* Botão temporário para acessar o painel */}
      <div className="absolute top-6 right-6 z-50">
        <Link 
          to="/dashboard" 
          className="text-offwhite hover:text-primary font-medium text-sm sm:text-base transition-colors border border-gray-700 hover:border-primary rounded-full px-4 py-2 bg-secondary/80 backdrop-blur-sm"
        >
          Acessar Painel
        </Link>
      </div>

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
          Pré-venda aberta — Vagas Limitadas
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-none tracking-tight"
        >
          PARE DE BRIGAR<br />
          <span className="text-primary">POR COMISSÃO.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
        >
          O ServiceFlow Oficina mostra ao mecânico, em tempo real no celular, quanto ele já fez. 
          Sua oficina ganha transparência. Seu mecânico ganha confiança. Você ganha paz.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-5 bg-primary text-secondary font-display text-xl sm:text-2xl hover:bg-white hover:text-secondary transition-colors duration-300 flex items-center justify-center gap-3 uppercase cursor-pointer shadow-[0_0_20px_rgba(255,107,26,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            QUERO MEU 50% VITALÍCIO — R$ 49
            <ArrowRight size={24} />
          </a>
          <button
            onClick={onOpenModal}
            className="w-full sm:w-auto px-8 py-5 bg-transparent border-2 border-offwhite text-offwhite font-display text-xl sm:text-2xl hover:bg-offwhite hover:text-secondary transition-colors duration-300 uppercase cursor-pointer"
          >
            Ver como funciona
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-sm sm:text-base text-gray-500 font-medium"
        >
          Apenas 50 vagas. Entrega em 60 dias. Garantia de 30 dias após entrega.
        </motion.p>
      </div>
    </section>
  );
}

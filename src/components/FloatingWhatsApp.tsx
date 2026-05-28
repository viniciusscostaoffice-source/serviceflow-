import { MessageCircle } from 'lucide-react';
import { whatsappNumber } from '../config/env';
import { motion } from 'motion/react';

export function FloatingWhatsApp() {
  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}?text=Oi! Gostaria de saber mais sobre a pré-venda do ServiceFlow Oficina.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[1000] bg-[#25D366] text-white p-4 rounded-full shadow-[0_4px_15px_rgba(37,211,102,0.4)] hover:bg-[#128C7E] transition-colors focus:outline-none focus:ring-4 focus:ring-[#25D366]/50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Falar conosco no WhatsApp"
    >
      <MessageCircle size={32} />
    </motion.a>
  );
}

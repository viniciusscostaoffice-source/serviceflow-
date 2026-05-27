import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { webhookUrl } from '../config/env';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadModal({ isOpen, onClose }: LeadModalProps) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      if (webhookUrl && webhookUrl !== 'https://your-webhook-url.com') {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            whatsapp,
            source: 'Landing Page ServiceFlow - Quero Saber Mais',
            timestamp: new Date().toISOString()
          })
        });
      } else {
        // Simulate webhook delay if not set
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setName('');
        setWhatsapp('');
      }, 3000);
      
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-secondary border border-gray-800 p-8 shadow-2xl texture-bg"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {status === 'success' ? (
              <div className="text-center py-10 space-y-4">
                <CheckCircle size={64} className="text-success mx-auto mb-4" />
                <h3 className="font-display text-3xl text-white">Tudo certo!</h3>
                <p className="text-gray-400">
                  Logo nossa equipe entrará em contato com você pelo WhatsApp.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-3xl text-white mb-2 uppercase">Quer saber mais?</h3>
                <p className="text-gray-400 mb-8 text-sm">
                  Deixe seus dados e nossa equipe (de mecânicos) vai te chamar no WhatsApp pra tirar todas as suas dúvidas.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Seu Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-none px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="João da Silva"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300 mb-1">
                      Seu WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      required
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-none px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  {status === 'error' && (
                     <p className="text-red-500 text-sm mt-2">Ocorreu um erro ao enviar. Tente novamente.</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-primary text-secondary font-display text-xl uppercase px-4 py-4 hover:bg-white transition-colors duration-300 mt-6 flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Enviar pra equipe'
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

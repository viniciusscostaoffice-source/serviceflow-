import { MonitorPlay, Calculator, BellRing, History } from 'lucide-react';
import { motion } from 'motion/react';
import { ScrollReveal } from '../ScrollReveal';

const features = [
  { icon: MonitorPlay, text: "Gerente lança a OS no computador" },
  { icon: Calculator,  text: "Sistema calcula a comissão automaticamente" },
  { icon: BellRing,    text: "Mecânico recebe notificação no celular" },
  { icon: History,     text: "Histórico salvo pra sempre, sem perder nada" },
];

const orders = [
  { os: 'OS #4092', val: '+ R$ 45,00',  desc: 'Troca de Óleo' },
  { os: 'OS #4091', val: '+ R$ 120,00', desc: 'Embreagem' },
  { os: 'OS #4088', val: '+ R$ 35,00',  desc: 'Alinhamento' },
  { os: 'OS #4085', val: '+ R$ 210,00', desc: 'Retífica Motor' },
];

export function Solution() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary text-offwhite texture-bg border-y border-primary/10">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center mb-16 md:mb-24">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl max-w-3xl mx-auto leading-tight">
              COMISSÃO CLARA. MECÂNICO CONFIANTE.<br />
              <span className="text-primary">VOCÊ NO CONTROLE.</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Mockup do celular */}
          <ScrollReveal direction="left" delay={200} duration={800}>
            <motion.div
              className="relative mx-auto w-full max-w-sm"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="relative border-gray-800 bg-gray-900 border-[14px] rounded-[2.5rem] h-[600px] w-full shadow-2xl overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-3xl w-40 mx-auto z-20"></div>
                <div className="bg-[#121212] h-full w-full flex flex-col pt-8 pb-4">
                  <div className="px-6 py-4 flex-1">
                    <div className="text-center mb-8">
                      <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider font-semibold">Seu Saldo</p>
                      <h3 className="text-4xl text-white font-display">R$ 1.247,50</h3>
                      <p className="text-primary text-xs mt-1 uppercase font-bold inline-flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                        </span>
                        Acumulado este mês
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-xs text-gray-500 uppercase font-bold mb-2">Últimas OSs</p>
                      {orders.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.6 + i * 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="bg-gray-800/50 rounded-lg p-3 flex justify-between items-center border border-gray-700/50"
                        >
                          <div>
                            <p className="text-white text-sm font-medium">{item.os}</p>
                            <p className="text-gray-400 text-xs">{item.desc}</p>
                          </div>
                          <span className="text-success font-bold text-sm">{item.val}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-3xl rounded-full -z-10"
                animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </ScrollReveal>

          {/* Features list */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} direction="right" delay={index * 120} duration={600}>
                <div className="flex items-start gap-6 group">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex-shrink-0 w-12 h-12 bg-primary/10 border border-primary text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-secondary shadow-[0_0_15px_rgba(255,107,26,0.15)] rounded-none"
                  >
                    <feature.icon size={24} />
                  </motion.div>
                  <div>
                    <h4 className="text-xl sm:text-2xl font-medium text-gray-200 mt-2">{feature.text}</h4>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

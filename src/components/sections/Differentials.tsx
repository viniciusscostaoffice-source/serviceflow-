import { Smartphone, History, FileText, Blocks } from 'lucide-react';
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
    description: "Não precisa trocar de sistema. O ServiceFlow entra como um complemento — você lança as OSs aqui e continua com seu ERP normalmente."
  }
];

export function Differentials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-secondary relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #0A0A0A 0, #0A0A0A 2px, transparent 2px, transparent 12px)' }}
      />

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
            <ScrollReveal key={index} direction="up" delay={index * 150} duration={600}>
              <div className="bg-secondary text-offwhite p-8 md:p-10 border-2 border-transparent hover:border-black transition-colors h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary text-secondary">
                    <diff.icon size={28} />
                  </div>
                  <h3 className="font-display text-2xl m-0 leading-tight">{diff.title}</h3>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">{diff.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

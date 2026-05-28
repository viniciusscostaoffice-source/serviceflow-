import { Flame, FileSpreadsheet, UserMinus } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';

const painPoints = [
  {
    icon: Flame,
    title: "Final do mês é guerra",
    description: "Mecânico desconfia do número, dono perde tempo refazendo cálculo, briga toda vez."
  },
  {
    icon: FileSpreadsheet,
    title: "Planilha bagunçada",
    description: "Excel que ninguém entende, fórmula quebrada, histórico que some quando precisa."
  },
  {
    icon: UserMinus,
    title: "Mecânico bom indo embora",
    description: "Sem transparência, profissional bom procura oficina que paga com clareza."
  }
];

export function PainPoints() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-offwhite text-secondary">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up" duration={600}>
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-secondary">
              Você reconhece essa cena?
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 150} duration={600}>
              <div className="bg-white p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="w-14 h-14 bg-red-100 flex items-center justify-center rounded-lg mb-6 text-red-600">
                  <point.icon size={32} />
                </div>
                <h3 className="font-display text-2xl mb-4 text-secondary">{point.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {point.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Star, Quote } from 'lucide-react';
import { ScrollReveal } from '../ScrollReveal';

const testimonials = [
  {
    name: "Rodrigo Alves",
    role: "Dono — Alves Auto Center",
    city: "São Paulo, SP",
    avatar: "RA",
    stars: 5,
    text: "Antes do ServiceFlow, todo dia 30 era uma guerra. Meu melhor mecânico chegou a ameaçar ir embora por causa de R$80 de diferença no cálculo. Hoje ele mesmo confere tudo no celular e nunca mais discutimos sobre comissão.",
  },
  {
    name: "Claudinho Ferreira",
    role: "Mecânico — 11 anos de profissão",
    city: "Campinas, SP",
    avatar: "CF",
    stars: 5,
    text: "Eu ficava com aquela pulga atrás da orelha o mês todo. Ser que tão me passando pra trás? Agora vejo cada OS que fecho no celular na hora. Confio no dono, o dono confia em mim. É outra relação.",
  },
  {
    name: "Marcos Teixeira",
    role: "Proprietário — Teixeira Mecânica",
    city: "Belo Horizonte, MG",
    avatar: "MT",
    stars: 5,
    text: "Perdi dois mecânicos bons em 2023 por causa de briga de comissão. Implantei o ServiceFlow e em 3 meses a equipe estabilizou. O retorno foi mais do que o custo da ferramenta no primeiro mês.",
  },
  {
    name: "Paulo Henrique Costa",
    role: "Sócio-gerente — PHC Service",
    city: "Curitiba, PR",
    avatar: "PC",
    stars: 5,
    text: "Tentei planilha, tentei anotar no caderno, tentei app genérico. Nada funcionava porque nenhum era feito pra oficina. O ServiceFlow é diferente: foi feito pra esse problema específico e resolve de vez.",
  },
];

const stats = [
  { value: "87%", label: "das oficinas eliminaram brigas de comissão no 1º mês" },
  { value: "3x", label: "mais rápido fechar a folha no fim do mês" },
  { value: "R$ 0", label: "de perda por erro de cálculo após implantação" },
  { value: "94%", label: "dos mecânicos aprovam a transparência do sistema" },
];

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary text-offwhite">
      <div className="max-w-7xl mx-auto">

        {/* Stats strip */}
        <ScrollReveal direction="up" duration={600}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-primary/20 border border-primary/20 mb-20">
            {stats.map((stat, i) => (
              <div key={i} className="bg-secondary px-6 py-8 text-center">
                <p className="font-display text-4xl sm:text-5xl text-primary mb-2">{stat.value}</p>
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
              <div className="bg-[#111] border border-gray-800 p-8 flex flex-col gap-6 h-full hover:border-primary/40 transition-colors">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} className="fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative flex-1">
                  <Quote size={24} className="text-primary/30 absolute -top-1 -left-1" />
                  <p className="text-gray-300 text-lg leading-relaxed pl-6">
                    {t.text}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 pt-2 border-t border-gray-800">
                  <div className="w-11 h-11 bg-primary text-secondary font-display text-sm flex items-center justify-center flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}

// Fonte única de dados mock — substitua chamadas ao Supabase aqui quando integrar backend

export type StatusOS = 'aberta' | 'concluida' | 'paga' | 'em_pendencia' | 'cancelada';

export interface OS {
  id: number;
  num: string;
  data: string; // ISO date string
  mecanico: string;
  mecanicoId: number;
  cliente: string;
  veiculo: string;
  placa: string;
  totalPecas: number;
  totalMaoObra: number;
  comissao: number;
  status: StatusOS;
}

export interface Mecanico {
  id: number;
  nome: string;
  fone: string;
  comissaoPadrao: number;
  status: 'Ativo' | 'Inativo' | 'Atendente';
}

export interface Pendencia {
  id: number;
  tipo: string;
  descricao: string;
  data: string;
  osId: string;
  severidade: 'alta' | 'media';
  resolvida: boolean;
}

export const mecanicos: Mecanico[] = [];

export const ordens: OS[] = [];

export const pendencias: Pendencia[] = [];

// Helpers de cálculo reutilizáveis

export function filtrarPorMes(lista: OS[], ano: number, mes: number) {
  return lista.filter((os) => {
    const d = new Date(os.data);
    return d.getFullYear() === ano && d.getMonth() + 1 === mes;
  });
}

export function somarComissaoPorMecanico(lista: OS[]) {
  const mapa: Record<string, number> = {};
  for (const os of lista) {
    if (os.status === 'cancelada') continue;
    mapa[os.mecanico] = (mapa[os.mecanico] ?? 0) + os.comissao;
  }
  return Object.entries(mapa)
    .map(([name, comissao]) => ({ name, comissao }))
    .sort((a, b) => b.comissao - a.comissao);
}

export function calcularKpis(lista: OS[]) {
  const ativas = lista.filter((os) => os.status !== 'cancelada');
  const totalFaturamento = ativas.reduce((s, os) => s + os.totalMaoObra + os.totalPecas, 0);
  const totalComissao = ativas.reduce((s, os) => s + os.comissao, 0);
  const totalMaoObra = ativas.reduce((s, os) => s + os.totalMaoObra, 0);
  return { totalOs: lista.length, totalFaturamento, totalComissao, totalMaoObra };
}

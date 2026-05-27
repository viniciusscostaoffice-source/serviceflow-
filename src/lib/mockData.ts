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

export const mecanicos: Mecanico[] = [
  { id: 1, nome: 'Carlos Souza',   fone: '(11) 99999-1111', comissaoPadrao: 15, status: 'Ativo' },
  { id: 2, nome: 'Paulo Oliveira', fone: '(11) 98888-2222', comissaoPadrao: 20, status: 'Ativo' },
  { id: 3, nome: 'Zé Roberto',     fone: '(11) 97777-3333', comissaoPadrao: 15, status: 'Ativo' },
];

export const ordens: OS[] = [
  { id: 1,  num: '#1045', data: '2026-05-27', mecanicoId: 1, mecanico: 'Carlos', cliente: 'João Silva',    veiculo: 'Gol',       placa: 'ABC-1234', totalPecas: 100, totalMaoObra: 150, comissao: 22.50, status: 'concluida' },
  { id: 2,  num: '#1044', data: '2026-05-26', mecanicoId: 2, mecanico: 'Paulo',  cliente: 'Ana Beatriz',   veiculo: 'Corolla',   placa: 'DEF-5678', totalPecas: 600, totalMaoObra: 600, comissao: 120.00, status: 'aberta' },
  { id: 3,  num: '#1043', data: '2026-05-24', mecanicoId: 1, mecanico: 'Carlos', cliente: 'Pedro Souza',   veiculo: 'HB20',      placa: 'GHI-9012', totalPecas: 200, totalMaoObra: 250, comissao: 37.50, status: 'paga' },
  { id: 4,  num: '#1042', data: '2026-05-23', mecanicoId: 3, mecanico: 'Zé',     cliente: 'Maria Lima',    veiculo: 'Onix',      placa: 'JKL-3456', totalPecas: 0,   totalMaoObra: 80,  comissao: 12.00, status: 'em_pendencia' },
  { id: 5,  num: '#1041', data: '2026-05-22', mecanicoId: 2, mecanico: 'Paulo',  cliente: 'Rui Barbosa',   veiculo: 'Civic',     placa: 'MNO-7890', totalPecas: 400, totalMaoObra: 500, comissao: 100.00, status: 'concluida' },
  { id: 6,  num: '#1040', data: '2026-05-21', mecanicoId: 1, mecanico: 'Carlos', cliente: 'Lúcia Ferreira', veiculo: 'Palio',    placa: 'PQR-1234', totalPecas: 50,  totalMaoObra: 100, comissao: 15.00, status: 'paga' },
  { id: 7,  num: '#1039', data: '2026-05-20', mecanicoId: 3, mecanico: 'Zé',     cliente: 'Fábio Alves',   veiculo: 'Creta',    placa: 'STU-5678', totalPecas: 300, totalMaoObra: 700, comissao: 105.00, status: 'concluida' },
  { id: 8,  num: '#1038', data: '2026-05-19', mecanicoId: 2, mecanico: 'Paulo',  cliente: 'Cláudia Neves', veiculo: 'Sandero',  placa: 'VWX-9012', totalPecas: 150, totalMaoObra: 350, comissao: 70.00, status: 'paga' },
  { id: 9,  num: '#1037', data: '2026-05-15', mecanicoId: 1, mecanico: 'Carlos', cliente: 'André Costa',   veiculo: 'Polo',     placa: 'YZA-3456', totalPecas: 800, totalMaoObra: 900, comissao: 135.00, status: 'paga' },
  { id: 10, num: '#1036', data: '2026-05-10', mecanicoId: 3, mecanico: 'Zé',     cliente: 'Tatiane Rocha', veiculo: 'Hilux',    placa: 'BCD-7890', totalPecas: 1200, totalMaoObra: 1500, comissao: 225.00, status: 'concluida' },
  { id: 11, num: '#1035', data: '2026-04-28', mecanicoId: 1, mecanico: 'Carlos', cliente: 'Marcos Vieira', veiculo: 'Fiat 500', placa: 'EFG-1111', totalPecas: 200, totalMaoObra: 400, comissao: 60.00, status: 'paga' },
  { id: 12, num: '#1034', data: '2026-04-25', mecanicoId: 2, mecanico: 'Paulo',  cliente: 'Jéssica Lima',  veiculo: 'Fiesta',   placa: 'HIJ-2222', totalPecas: 100, totalMaoObra: 200, comissao: 40.00, status: 'paga' },
  { id: 13, num: '#1033', data: '2026-04-20', mecanicoId: 3, mecanico: 'Zé',     cliente: 'Bruno Santos',  veiculo: 'Ranger',   placa: 'KLM-3333', totalPecas: 500, totalMaoObra: 1200, comissao: 180.00, status: 'concluida' },
  { id: 14, num: '#1032', data: '2026-04-15', mecanicoId: 1, mecanico: 'Carlos', cliente: 'Elaine Dias',   veiculo: 'Corsa',    placa: 'NOP-4444', totalPecas: 300, totalMaoObra: 600, comissao: 90.00, status: 'cancelada' },
];

export const pendencias: Pendencia[] = [
  {
    id: 1,
    tipo: 'OS Cancelada com Comissão',
    descricao: 'A OS #1042 foi cancelada, mas já estava constando no fechamento parcial do mecânico Zé.',
    data: '2026-05-23',
    osId: '4',
    severidade: 'alta',
    resolvida: false,
  },
  {
    id: 2,
    tipo: 'Edição de Valor',
    descricao: 'Valor da Mão de Obra alterado de R$ 250 para R$ 150 na OS #1040 após a finalização.',
    data: '2026-05-21',
    osId: '6',
    severidade: 'media',
    resolvida: false,
  },
];

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

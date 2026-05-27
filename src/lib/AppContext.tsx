import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { supabase } from './supabase';
import type { OS, Mecanico, Pendencia } from './mockData';

interface AppContextValue {
  ordens: OS[];
  pendencias: Pendencia[];
  mecanicos: Mecanico[];
  loading: boolean;
  resolverPendencia: (id: number) => void;
  descartarPendencia: (id: number) => void;
  atualizarComissao: (mecanicoId: number, novaComissao: number) => void;
  pendenciasAtivas: number;
  recarregar: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// Mapeia snake_case do Supabase → camelCase do frontend
function mapOS(row: Record<string, unknown>): OS {
  return {
    id:           row.id as number,
    num:          row.num as string,
    data:         row.data as string,
    mecanico:     (row.mecanicos as Record<string, unknown>)?.nome as string ?? '',
    mecanicoId:   row.mecanico_id as number,
    cliente:      row.cliente as string,
    veiculo:      row.veiculo as string,
    placa:        row.placa as string,
    totalPecas:   Number(row.total_pecas),
    totalMaoObra: Number(row.total_mao_obra),
    comissao:     Number(row.comissao),
    status:       row.status as OS['status'],
  };
}

function mapMecanico(row: Record<string, unknown>): Mecanico {
  return {
    id:             row.id as number,
    nome:           row.nome as string,
    fone:           row.fone as string,
    comissaoPadrao: Number(row.comissao_padrao),
    status:         row.status as Mecanico['status'],
  };
}

function mapPendencia(row: Record<string, unknown>): Pendencia {
  return {
    id:         row.id as number,
    tipo:       row.tipo as string,
    descricao:  row.descricao as string,
    data:       (row.criado_em as string)?.slice(0, 10) ?? '',
    osId:       String(row.os_id ?? ''),
    severidade: row.severidade as Pendencia['severidade'],
    resolvida:  row.resolvida as boolean,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ordens, setOrdens]         = useState<OS[]>([]);
  const [pendencias, setPendencias] = useState<Pendencia[]>([]);
  const [mecanicos, setMecanicos]   = useState<Mecanico[]>([]);
  const [loading, setLoading]       = useState(true);

  async function carregar() {
    setLoading(true);
    try {
      const [{ data: osData }, { data: mecData }, { data: pendData }] = await Promise.all([
        supabase
          .from('ordens_servico')
          .select('*, mecanicos(nome)')
          .order('data', { ascending: false }),
        supabase
          .from('mecanicos')
          .select('*')
          .order('nome'),
        supabase
          .from('pendencias')
          .select('*')
          .order('criado_em', { ascending: false }),
      ]);

      if (osData)   setOrdens(osData.map(mapOS));
      if (mecData)  setMecanicos(mecData.map(mapMecanico));
      if (pendData) setPendencias(pendData.map(mapPendencia));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();

    // Realtime: atualiza quando qualquer OS muda
    const canal = supabase
      .channel('serviceflow-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ordens_servico' }, carregar)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pendencias' }, carregar)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mecanicos' }, carregar)
      .subscribe();

    return () => { supabase.removeChannel(canal); };
  }, []);

  const resolverPendencia = useCallback(async (id: number) => {
    await supabase.from('pendencias').update({ resolvida: true }).eq('id', id);
    setPendencias((prev) => prev.map((p) => (p.id === id ? { ...p, resolvida: true } : p)));
  }, []);

  const descartarPendencia = useCallback(async (id: number) => {
    await supabase.from('pendencias').delete().eq('id', id);
    setPendencias((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const atualizarComissao = useCallback(async (mecanicoId: number, novaComissao: number) => {
    await supabase.from('mecanicos').update({ comissao_padrao: novaComissao }).eq('id', mecanicoId);
    setMecanicos((prev) =>
      prev.map((m) => (m.id === mecanicoId ? { ...m, comissaoPadrao: novaComissao } : m)),
    );
  }, []);

  const pendenciasAtivas = pendencias.filter((p) => !p.resolvida).length;

  return (
    <AppContext.Provider value={{
      ordens, pendencias, mecanicos, loading,
      resolverPendencia, descartarPendencia, atualizarComissao,
      pendenciasAtivas, recarregar: carregar,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext deve ser usado dentro de AppProvider');
  return ctx;
}

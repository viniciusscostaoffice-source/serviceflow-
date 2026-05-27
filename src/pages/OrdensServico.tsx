import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button, buttonVariants } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import { useAppContext } from '../lib/AppContext';
import { mecanicos, type StatusOS } from '../lib/mockData';

const STATUS_LABELS: Record<StatusOS, string> = {
  aberta:       'Aberta',
  concluida:    'Concluída',
  paga:         'Paga',
  em_pendencia: 'Pendência',
  cancelada:    'Cancelada',
};

const PAGE_SIZE = 8;

function StatusBadge({ status }: { status: StatusOS }) {
  switch (status) {
    case 'concluida':    return <Badge className="bg-green-500 text-white">Concluída</Badge>;
    case 'aberta':       return <Badge variant="outline" className="text-secondary border-secondary">Aberta</Badge>;
    case 'paga':         return <Badge className="bg-gray-800 text-white">Paga</Badge>;
    case 'em_pendencia': return <Badge className="bg-red-500 text-white">Pendência</Badge>;
    case 'cancelada':    return <Badge variant="destructive">Cancelada</Badge>;
    default:             return <Badge variant="outline">{status}</Badge>;
  }
}

function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function OrdensServico() {
  const { ordens } = useAppContext();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusOS | ''>('');
  const [filterMecanico, setFilterMecanico] = useState<string>('');
  const [page, setPage] = useState(1);

  const filtradas = useMemo(() => {
    const q = search.toLowerCase().trim();
    return ordens.filter((os) => {
      const matchSearch =
        !q ||
        os.num.toLowerCase().includes(q) ||
        os.cliente.toLowerCase().includes(q) ||
        os.placa.toLowerCase().includes(q) ||
        os.veiculo.toLowerCase().includes(q);
      const matchStatus = !filterStatus || os.status === filterStatus;
      const matchMec = !filterMecanico || os.mecanico === filterMecanico;
      return matchSearch && matchStatus && matchMec;
    });
  }, [ordens, search, filterStatus, filterMecanico]);

  const totalPages = Math.max(1, Math.ceil(filtradas.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginadas = filtradas.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function resetPage() {
    setPage(1);
  }

  function clearFilters() {
    setSearch('');
    setFilterStatus('');
    setFilterMecanico('');
    setPage(1);
  }

  const hasFilter = search || filterStatus || filterMecanico;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-3xl uppercase text-secondary">Ordens de Serviço</h1>
        <Link
          to="/os/nova"
          className={buttonVariants({ className: 'bg-primary hover:bg-[#E55A15] text-white' })}
        >
          <Plus className="mr-2" size={20} />
          Nova OS
        </Link>
      </header>

      {/* Barra de filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por placa, cliente ou número..."
            className="pl-10"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value as StatusOS | ''); resetPage(); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-secondary font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 w-full sm:w-auto"
        >
          <option value="">Todos os status</option>
          {(Object.keys(STATUS_LABELS) as StatusOS[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>

        <select
          value={filterMecanico}
          onChange={(e) => { setFilterMecanico(e.target.value); resetPage(); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-secondary font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 w-full sm:w-auto"
        >
          <option value="">Todos os mecânicos</option>
          {mecanicos.map((m) => (
            <option key={m.id} value={m.nome.split(' ')[0]}>{m.nome.split(' ')[0]}</option>
          ))}
        </select>

        {hasFilter && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 shrink-0">
            <X size={16} className="mr-1" /> Limpar
          </Button>
        )}
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Mecânico</TableHead>
                <TableHead>Cliente / Veículo</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-right">Comissão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginadas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                    Nenhuma OS encontrada com esses filtros.
                  </TableCell>
                </TableRow>
              ) : (
                paginadas.map((os) => (
                  <TableRow key={os.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-bold">{os.num}</TableCell>
                    <TableCell>{new Date(os.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{os.mecanico}</TableCell>
                    <TableCell>
                      <div className="font-medium text-black">{os.cliente}</div>
                      <div className="text-xs text-muted-foreground">{os.veiculo} · {os.placa}</div>
                    </TableCell>
                    <TableCell className="text-right">{formatBRL(os.totalMaoObra + os.totalPecas)}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {formatBRL(os.comissao)}
                    </TableCell>
                    <TableCell><StatusBadge status={os.status} /></TableCell>
                    <TableCell className="text-right">
                      <Link
                        to={`/os/${os.id}`}
                        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                      >
                        Ver
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-500">
            {filtradas.length === 0
              ? 'Nenhum resultado'
              : `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtradas.length)} de ${filtradas.length}`}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-7 w-7 rounded text-xs font-medium transition-colors ${
                  p === currentPage
                    ? 'bg-primary text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

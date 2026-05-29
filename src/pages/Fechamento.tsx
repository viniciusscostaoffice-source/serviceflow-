import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Download, CheckCircle2, CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../lib/AppContext';
import type { OS } from '../lib/mockData';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── helpers ────────────────────────────────────────────────────────────────

function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR');
}

type Periodo = 'dia' | 'semana' | 'mes' | 'ano';

const PERIODO_LABELS: Record<Periodo, string> = {
  dia: 'Hoje',
  semana: 'Esta semana',
  mes: 'Este mês',
  ano: 'Este ano',
};

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DIAS_SEMANA = ['D','S','T','Q','Q','S','S'];

function Calendario({ dataSelecionada, onChange, onClear }: {
  dataSelecionada: Date | null;
  onChange: (d: Date) => void;
  onClear: () => void;
}) {
  const hoje = new Date();
  const [mes, setMes] = useState(dataSelecionada?.getMonth() ?? hoje.getMonth());
  const [ano, setAno] = useState(dataSelecionada?.getFullYear() ?? hoje.getFullYear());

  function anteriorMes() {
    if (mes === 0) { setMes(11); setAno(a => a - 1); }
    else setMes(m => m - 1);
  }
  function proximoMes() {
    if (mes === 11) { setMes(0); setAno(a => a + 1); }
    else setMes(m => m + 1);
  }

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const celulas = Array.from({ length: primeiroDia + diasNoMes }, (_, i) =>
    i < primeiroDia ? null : i - primeiroDia + 1
  );

  function isSelecionado(dia: number) {
    if (!dataSelecionada) return false;
    return dataSelecionada.getDate() === dia &&
      dataSelecionada.getMonth() === mes &&
      dataSelecionada.getFullYear() === ano;
  }

  function isHoje(dia: number) {
    return dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear();
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-72 z-50">
      {/* Navegação de mês */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={anteriorMes} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-bold text-secondary">{MESES[mes]} {ano}</span>
        <button onClick={proximoMes} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Cabeçalho dias da semana */}
      <div className="grid grid-cols-7 mb-1">
        {DIAS_SEMANA.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Dias */}
      <div className="grid grid-cols-7 gap-0.5">
        {celulas.map((dia, i) => (
          <div key={i}>
            {dia ? (
              <button
                onClick={() => onChange(new Date(ano, mes, dia))}
                className={`w-full aspect-square flex items-center justify-center text-sm rounded-lg font-medium transition-all ${
                  isSelecionado(dia)
                    ? 'bg-primary text-white shadow-[0_2px_8px_rgba(255,107,26,0.4)]'
                    : isHoje(dia)
                    ? 'border-2 border-primary text-primary font-bold'
                    : 'hover:bg-primary/10 text-gray-700'
                }`}
              >
                {dia}
              </button>
            ) : <div />}
          </div>
        ))}
      </div>

      {/* Limpar */}
      {dataSelecionada && (
        <button
          onClick={onClear}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={12} /> Limpar data
        </button>
      )}
    </div>
  );
}

function filtrarPorPeriodo(lista: OS[], periodo: Periodo, dataEspecifica: Date | null): OS[] {
  if (dataEspecifica) {
    return lista.filter((os) => {
      const d = new Date(os.data + 'T00:00:00');
      return d.toDateString() === dataEspecifica.toDateString();
    });
  }
  const agora = new Date();
  return lista.filter((os) => {
    const d = new Date(os.data + 'T00:00:00');
    if (periodo === 'dia') return d.toDateString() === agora.toDateString();
    if (periodo === 'semana') {
      const inicio = new Date(agora);
      inicio.setDate(agora.getDate() - agora.getDay());
      inicio.setHours(0, 0, 0, 0);
      return d >= inicio;
    }
    if (periodo === 'mes') return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear();
    if (periodo === 'ano') return d.getFullYear() === agora.getFullYear();
    return true;
  });
}

function calcularResumo(lista: OS[]) {
  const ativas = lista.filter((os) => os.status !== 'cancelada');
  return {
    qtdOs: ativas.length,
    totalMaoObra: ativas.reduce((s, os) => s + os.totalMaoObra, 0),
    totalPecas: ativas.reduce((s, os) => s + os.totalPecas, 0),
    totalComissao: ativas.reduce((s, os) => s + os.comissao, 0),
    totalFaturamento: ativas.reduce((s, os) => s + os.totalMaoObra + os.totalPecas, 0),
  };
}

const STATUS_BADGE: Record<string, React.ReactElement> = {
  aberta:       <Badge variant="outline" className="border-blue-400 text-blue-600">Aberta</Badge>,
  concluida:    <Badge className="bg-green-100 text-green-700 border-green-300">Concluída</Badge>,
  paga:         <Badge className="bg-emerald-500 text-white">Paga</Badge>,
  em_pendencia: <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Pendência</Badge>,
  cancelada:    <Badge className="bg-gray-100 text-gray-500 border-gray-300">Cancelada</Badge>,
};

// ─── Export PDF ──────────────────────────────────────────────────────────────

function exportarPDF(lista: OS[], mecNome: string, periodo: string, oficina = 'ServiceFlow Oficina') {
  const ativas = lista.filter((os) => os.status !== 'cancelada');
  const resumo = calcularResumo(lista);
  const geradoEm = new Date().toLocaleString('pt-BR');
  const slug = `fechamento-${mecNome.replace(/\s+/g, '-').toLowerCase()}-${periodo.replace(/\s+/g, '-').toLowerCase()}`;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();

  // ── Cabeçalho ──
  doc.setFillColor(10, 10, 10); // #0A0A0A
  doc.rect(0, 0, W, 38, 'F');

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 107, 26); // #FF6B1A
  doc.text('SERVICEFLOW', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 180, 180);
  doc.text(oficina, 14, 21);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('FECHAMENTO DE COMISSÃO', 14, 31);

  // Info direita
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 160, 160);
  doc.text(`Gerado em: ${geradoEm}`, W - 14, 15, { align: 'right' });

  // ── Dados do mecânico ──
  doc.setFillColor(245, 245, 240); // #F5F5F0
  doc.rect(0, 38, W, 22, 'F');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 10, 10);
  doc.text(`Mecânico: ${mecNome}`, 14, 47);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Período: ${periodo}`, 14, 54);
  doc.text(`Total de OSs: ${resumo.qtdOs}`, W / 2, 54, { align: 'center' });

  // ── KPIs ──
  const kpiY = 66;
  const kpiW = (W - 28 - 9) / 4;
  const kpis = [
    { label: 'Comissão Total', value: formatBRL(resumo.totalComissao), destaque: true },
    { label: 'Mão de Obra', value: formatBRL(resumo.totalMaoObra), destaque: false },
    { label: 'Peças', value: formatBRL(resumo.totalPecas), destaque: false },
    { label: 'Faturamento', value: formatBRL(resumo.totalFaturamento), destaque: false },
  ];
  kpis.forEach((k, i) => {
    const x = 14 + i * (kpiW + 3);
    if (k.destaque) {
      doc.setFillColor(255, 107, 26);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.roundedRect(x, kpiY, kpiW, 18, 2, 2, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(k.destaque ? 255 : 120, k.destaque ? 255 : 120, k.destaque ? 255 : 120);
    doc.text(k.label.toUpperCase(), x + kpiW / 2, kpiY + 6, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(k.destaque ? 255 : 10, k.destaque ? 255 : 10, k.destaque ? 255 : 10);
    doc.text(k.value, x + kpiW / 2, kpiY + 13, { align: 'center' });
  });

  // ── Tabela de OSs ──
  autoTable(doc, {
    startY: kpiY + 24,
    head: [['OS', 'Data', 'Cliente', 'Veículo / Placa', 'Mão de Obra', 'Peças', 'Comissão', 'Status']],
    body: ativas.map((os) => [
      os.num,
      formatDate(os.data),
      os.cliente,
      `${os.veiculo}\n${os.placa}`,
      formatBRL(os.totalMaoObra),
      formatBRL(os.totalPecas),
      formatBRL(os.comissao),
      os.status.charAt(0).toUpperCase() + os.status.slice(1),
    ]),
    foot: [[
      { content: 'TOTAL', colSpan: 4, styles: { fontStyle: 'bold', halign: 'right' } },
      { content: formatBRL(resumo.totalMaoObra), styles: { fontStyle: 'bold' } },
      { content: formatBRL(resumo.totalPecas), styles: { fontStyle: 'bold' } },
      { content: formatBRL(resumo.totalComissao), styles: { fontStyle: 'bold', textColor: [255, 107, 26] } },
      '',
    ]],
    headStyles: {
      fillColor: [10, 10, 10],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    footStyles: {
      fillColor: [245, 245, 240],
      textColor: [10, 10, 10],
      fontSize: 9,
    },
    bodyStyles: { fontSize: 8, textColor: [40, 40, 40] },
    alternateRowStyles: { fillColor: [250, 250, 248] },
    columnStyles: {
      0: { cellWidth: 16, fontStyle: 'bold' },
      1: { cellWidth: 20 },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right', textColor: [22, 163, 74], fontStyle: 'bold' },
      7: { cellWidth: 22 },
    },
    margin: { left: 14, right: 14 },
    styles: { cellPadding: 3, lineColor: [230, 230, 225], lineWidth: 0.1 },
    didDrawPage: (data) => {
      // Rodapé em cada página
      const pageH = doc.internal.pageSize.getHeight();
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(180, 180, 180);
      doc.text(
        `ServiceFlow Oficina · ${mecNome} · ${periodo}`,
        14,
        pageH - 8,
      );
      doc.text(
        `Pág. ${(doc as any).internal.getCurrentPageInfo().pageNumber}`,
        W - 14,
        pageH - 8,
        { align: 'right' },
      );
    },
  });

  doc.save(`${slug}.pdf`);
  toast.success(`PDF exportado — ${mecNome} · ${periodo}`);
}

// ─── Botão de export ─────────────────────────────────────────────────────────

function BotaoExport({ lista, mecNome, periodo }: { lista: OS[]; mecNome: string; periodo: string }) {
  const ativas = lista.filter((os) => os.status !== 'cancelada');
  return (
    <Button
      size="sm"
      className="bg-primary hover:bg-[#E55A15] text-white gap-2 shadow-[0_2px_12px_rgba(255,107,26,0.25)]"
      onClick={() => exportarPDF(lista, mecNome, periodo)}
      disabled={ativas.length === 0}
    >
      <Download className="h-4 w-4" />
      Exportar PDF
    </Button>
  );
}

// ─── Card de resumo KPI ───────────────────────────────────────────────────────

function KpiCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200'}`}>
      <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${highlight ? 'opacity-80' : 'text-gray-400'}`}>
        {label}
      </p>
      <p className={`text-2xl font-display ${highlight ? 'text-white' : 'text-secondary'}`}>{value}</p>
    </div>
  );
}

// ─── Tabela de OSs ────────────────────────────────────────────────────────────

function TabelaOs({ lista }: { lista: OS[] }) {
  if (lista.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <CheckCircle2 size={36} className="mx-auto mb-2 opacity-30" />
        <p className="text-sm">Nenhuma OS neste período.</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>OS</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Veículo</TableHead>
            <TableHead className="text-right">Mão de Obra</TableHead>
            <TableHead className="text-right">Peças</TableHead>
            <TableHead className="text-right">Comissão</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lista.map((os) => (
            <TableRow key={os.id} className={os.status === 'cancelada' ? 'opacity-40' : ''}>
              <TableCell className="font-bold text-secondary">{os.num}</TableCell>
              <TableCell className="text-gray-600 whitespace-nowrap">{formatDate(os.data)}</TableCell>
              <TableCell className="text-gray-700">{os.cliente}</TableCell>
              <TableCell className="text-gray-600">{os.veiculo}</TableCell>
              <TableCell className="text-right text-gray-600">{formatBRL(os.totalMaoObra)}</TableCell>
              <TableCell className="text-right text-gray-600">{formatBRL(os.totalPecas)}</TableCell>
              <TableCell className="text-right font-bold text-green-600">{formatBRL(os.comissao)}</TableCell>
              <TableCell>{STATUS_BADGE[os.status]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function Fechamento() {
  const { ordens, mecanicos } = useAppContext();
  const [mecId, setMecId] = useState<number>(mecanicos[0]?.id ?? 1);
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const [dataEspecifica, setDataEspecifica] = useState<Date | null>(null);
  const [calAberto, setCalAberto] = useState(false);

  const mecSelecionado = mecanicos.find((m) => m.id === mecId);

  const osDoMecanico = useMemo(
    () => ordens.filter((os) => os.mecanicoId === mecId),
    [ordens, mecId],
  );

  const osFiltradas = useMemo(
    () => filtrarPorPeriodo(osDoMecanico, periodo, dataEspecifica),
    [osDoMecanico, periodo, dataEspecifica],
  );

  const resumo = useMemo(() => calcularResumo(osFiltradas), [osFiltradas]);

  const periodoLabel = dataEspecifica
    ? dataEspecifica.toLocaleDateString('pt-BR')
    : PERIODO_LABELS[periodo];
  const mecNome = mecSelecionado?.nome ?? 'Mecânico';

  function selecionarData(d: Date) {
    setDataEspecifica(d);
    setCalAberto(false);
  }

  function limparData() {
    setDataEspecifica(null);
    setCalAberto(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase text-secondary">Fechamento</h1>
          <p className="text-gray-500 text-sm mt-0.5">Análise de produção e comissão por mecânico</p>
        </div>
      </header>

      {/* Filtros: Mecânico + Período + Export — numa linha */}
      <Card className="shadow-sm">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-end gap-4">
            {/* Mecânico */}
            <div className="flex-1 min-w-[180px] space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Mecânico
              </label>
              <div className="flex gap-2 flex-wrap">
                {mecanicos.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMecId(m.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                      mecId === m.id
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-secondary/40'
                    }`}
                  >
                    {m.nome.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Período */}
            <div className="flex-1 min-w-[220px] space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Período
              </label>
              <div className="flex gap-2 flex-wrap items-center">
                {(Object.keys(PERIODO_LABELS) as Periodo[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPeriodo(p); setDataEspecifica(null); setCalAberto(false); }}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                      periodo === p && !dataEspecifica
                        ? 'bg-primary text-white border-primary shadow-[0_2px_12px_rgba(255,107,26,0.25)]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'
                    }`}
                  >
                    {PERIODO_LABELS[p]}
                  </button>
                ))}

                {/* Botão calendário */}
                <div className="relative">
                  <button
                    onClick={() => setCalAberto(v => !v)}
                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-all border flex items-center gap-1.5 ${
                      dataEspecifica
                        ? 'bg-primary text-white border-primary shadow-[0_2px_12px_rgba(255,107,26,0.25)]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-primary/40'
                    }`}
                  >
                    <CalendarDays size={15} />
                    {dataEspecifica ? dataEspecifica.toLocaleDateString('pt-BR') : 'Dia'}
                  </button>

                  {calAberto && (
                    <div className="absolute top-full mt-2 left-0 z-50">
                      <Calendario
                        dataSelecionada={dataEspecifica}
                        onChange={selecionarData}
                        onClear={limparData}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Export — alinhado à direita */}
            <div className="ml-auto pt-5">
              <BotaoExport lista={osFiltradas} mecNome={mecNome} periodo={periodoLabel} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cabeçalho de contexto */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm shrink-0">
          {mecNome.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-secondary text-lg leading-tight">{mecNome}</p>
          <p className="text-gray-400 text-sm">{periodoLabel} · {resumo.qtdOs} OS{resumo.qtdOs !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Comissão" value={formatBRL(resumo.totalComissao)} highlight />
        <KpiCard label="Mão de obra" value={formatBRL(resumo.totalMaoObra)} />
        <KpiCard label="Peças" value={formatBRL(resumo.totalPecas)} />
        <KpiCard label="Faturamento" value={formatBRL(resumo.totalFaturamento)} />
      </div>

      {/* Tabela de OSs */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-secondary">
            Ordens de Serviço — {mecNome} · {periodoLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TabelaOs lista={osFiltradas} />
        </CardContent>
      </Card>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Wrench, CircleDollarSign, Users, AlertTriangle, Plus, TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';
import { buttonVariants } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';
import { Link } from 'react-router-dom';
import { useAppContext } from '../lib/AppContext';
import { filtrarPorMes, somarComissaoPorMecanico, calcularKpis } from '../lib/mockData';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function TrendIcon({ value }: { value: number }) {
  if (value > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
  if (value < 0) return <TrendingDown className="h-3 w-3 text-red-500" />;
  return <Minus className="h-3 w-3 text-gray-400" />;
}

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'concluida': return <Badge className="bg-green-500 text-white text-[10px]">Concluída</Badge>;
    case 'aberta':    return <Badge variant="outline" className="text-secondary border-secondary text-[10px]">Aberta</Badge>;
    case 'paga':      return <Badge className="bg-gray-700 text-white text-[10px]">Paga</Badge>;
    case 'em_pendencia': return <Badge className="bg-red-500 text-white text-[10px]">Pendência</Badge>;
    case 'cancelada': return <Badge variant="destructive" className="text-[10px]">Cancelada</Badge>;
    default:          return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
  }
}

export function Dashboard() {
  const { ordens, pendenciasAtivas, mecanicos } = useAppContext();

  const now = new Date();
  const [mes, setMes] = useState(now.getMonth() + 1);
  const [ano] = useState(now.getFullYear());

  const today = now.toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const ordemMes = useMemo(() => filtrarPorMes(ordens, ano, mes), [ordens, ano, mes]);
  const ordemMesAnterior = useMemo(() => {
    const mesAnt = mes === 1 ? 12 : mes - 1;
    const anoAnt = mes === 1 ? ano - 1 : ano;
    return filtrarPorMes(ordens, anoAnt, mesAnt);
  }, [ordens, ano, mes]);

  const kpis = useMemo(() => calcularKpis(ordemMes), [ordemMes]);
  const kpisAnt = useMemo(() => calcularKpis(ordemMesAnterior), [ordemMesAnterior]);

  const mecAtivos = mecanicos.filter((m) => m.status === 'Ativo').length;

  function pct(atual: number, anterior: number) {
    if (anterior === 0) return atual > 0 ? 100 : 0;
    return Math.round(((atual - anterior) / anterior) * 100);
  }

  const trendOs = pct(kpis.totalOs, kpisAnt.totalOs);
  const trendFat = pct(kpis.totalFaturamento, kpisAnt.totalFaturamento);
  const trendCom = pct(kpis.totalComissao, kpisAnt.totalComissao);

  const dadosGrafico = useMemo(() => somarComissaoPorMecanico(ordemMes), [ordemMes]);

  const ultimasOs = useMemo(
    () => [...ordens].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 5),
    [ordens],
  );

  const daysInMonth = new Date(ano, mes, 0).getDate();
  const currentDay = mes === now.getMonth() + 1 && ano === now.getFullYear() ? now.getDate() : daysInMonth;
  const projectedComissao = currentDay > 0 ? (kpis.totalComissao / currentDay) * daysInMonth : 0;
  const projectedFat = currentDay > 0 ? (kpis.totalFaturamento / currentDay) * daysInMonth : 0;

  const isMesAtual = mes === now.getMonth() + 1 && ano === now.getFullYear();

  return (
    <div className="space-y-8 pb-20 relative min-h-[calc(100vh-6rem)]">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase text-secondary">
            Olá, {(localStorage.getItem('sf_usuario') || 'Gerente').split(' ')[0]}!
          </h1>
          <p className="text-gray-500 font-medium capitalize mt-1">Hoje é {today}</p>
        </div>

        {/* Seletor de mês */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Período:</label>
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white text-secondary font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {MESES.map((m, i) => (
              <option key={i} value={i + 1}>{m} {ano}</option>
            ))}
          </select>
          {!isMesAtual && (
            <button
              onClick={() => setMes(now.getMonth() + 1)}
              className="text-xs text-primary hover:underline font-medium"
            >
              Voltar ao atual
            </button>
          )}
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* OSs do Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OSs do Mês</CardTitle>
            <Wrench className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display">{kpis.totalOs}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendIcon value={trendOs} />
              <span className={trendOs >= 0 ? 'text-green-600' : 'text-red-500'}>
                {trendOs > 0 ? '+' : ''}{trendOs}%
              </span>
              &nbsp;em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        {/* Faturamento Bruto */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento Bruto</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display">{formatBRL(kpis.totalFaturamento)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendIcon value={trendFat} />
              <span className={trendFat >= 0 ? 'text-green-600' : 'text-red-500'}>
                {trendFat > 0 ? '+' : ''}{trendFat}%
              </span>
              {isMesAtual && (
                <span className="text-gray-400 ml-1">· proj. {formatBRL(projectedFat)}</span>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Comissão Total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissão Total</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-display text-green-600">{formatBRL(kpis.totalComissao)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendIcon value={trendCom} />
              <span className={trendCom >= 0 ? 'text-green-600' : 'text-red-500'}>
                {trendCom > 0 ? '+' : ''}{trendCom}%
              </span>
              {isMesAtual && (
                <span className="text-gray-400 ml-1">· proj. {formatBRL(projectedComissao)}</span>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Pendências */}
        {pendenciasAtivas > 0 ? (
          <Card className="border-red-500/30 bg-red-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Pendências</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display text-red-600">{pendenciasAtivas}</div>
              <Link to="/pendencias" className="text-xs text-red-500/80 hover:underline">
                Requer atenção imediata →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-500/30 bg-green-50/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Pendências</CardTitle>
              <AlertTriangle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-display text-green-600">0</div>
              <p className="text-xs text-green-600/80">Tudo em dia!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Gráfico + Últimas OSs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico comissão por mecânico */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Comissão por Mecânico</CardTitle>
            <CardDescription>{MESES[mes - 1]} {ano}</CardDescription>
          </CardHeader>
          <CardContent>
            {dadosGrafico.length === 0 ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
                <Wrench size={40} className="mb-3 opacity-30" />
                <p className="text-sm">Nenhuma OS neste período</p>
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 600 }} />
                    <YAxis tickFormatter={(v) => `R$${v}`} tick={{ fontSize: 11 }} />
                    <RechartsTooltip
                      cursor={{ fill: 'rgba(255,107,26,0.06)' }}
                      formatter={(value: number) => [formatBRL(value), 'Comissão']}
                    />
                    <Bar dataKey="comissao" fill="#FF6B1A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ranking de mecânicos */}
        <Card className="col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle>Ranking do Mês</CardTitle>
            <CardDescription>Produção de cada mecânico</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {mecAtivos === 0 ? (
              <p className="text-sm text-gray-400">Nenhum mecânico ativo.</p>
            ) : (
              mecanicos
                .filter((m) => m.status === 'Ativo')
                .map((mec, idx) => {
                  const dados = dadosGrafico.find((d) => d.name === mec.nome);
                  const comissao = dados?.comissao ?? 0;
                  const osCount = ordemMes.filter((os) => os.mecanicoId === mec.id && os.status !== 'cancelada').length;
                  const maxComissao = dadosGrafico[0]?.comissao ?? 1;
                  const pctBar = maxComissao > 0 ? (comissao / maxComissao) * 100 : 0;
                  return (
                    <div key={mec.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-400 w-4">#{idx + 1}</span>
                          <div className="h-7 w-7 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">
                            {mec.nome.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-secondary leading-none">{mec.nome.split(' ')[0]}</p>
                            <p className="text-[11px] text-gray-400">{osCount} OS</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-green-600">{formatBRL(comissao)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${pctBar}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Últimas OSs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas ordens de serviço lançadas</CardDescription>
          </div>
          <Link to="/os" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Ver todas
          </Link>
        </CardHeader>
        <CardContent>
          {ultimasOs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Wrench size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma OS lançada ainda.</p>
              <Link to="/os/nova" className="text-primary text-sm font-medium hover:underline mt-2 inline-block">
                Criar a primeira OS →
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {ultimasOs.map((os) => (
                <Link
                  key={os.id}
                  to={`/os/${os.id}`}
                  className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                      <Wrench size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-secondary">
                        {os.num} · {os.cliente}
                      </p>
                      <p className="text-xs text-gray-500">
                        {os.veiculo} · {os.mecanico} · {new Date(os.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-sm font-semibold">{formatBRL(os.totalMaoObra + os.totalPecas)}</p>
                    <StatusBadge status={os.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAB Nova OS */}
      <Tooltip>
        <TooltipTrigger render={
          <Link
            to="/os/nova"
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-primary hover:bg-[#E55A15] text-white p-4 rounded-full shadow-[0_4px_20px_rgba(255,107,26,0.3)] transition-transform hover:scale-105 active:scale-95 z-50 flex items-center justify-center"
          />
        }>
          <Plus size={24} />
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-secondary text-offwhite border-none font-bold uppercase tracking-wider text-xs mr-2">
          <p>Nova OS</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

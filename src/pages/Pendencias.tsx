import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { useAppContext } from '../lib/AppContext';

export function Pendencias() {
  const { pendencias, resolverPendencia, descartarPendencia } = useAppContext();
  const ativas = pendencias.filter((p) => !p.resolvida);
  const resolvidas = pendencias.filter((p) => p.resolvida);

  function handleResolver(id: number) {
    resolverPendencia(id);
    toast.success('Pendência marcada como resolvida.');
  }

  function handleDescartar(id: number) {
    descartarPendencia(id);
    toast.info('Pendência descartada.');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="font-display text-3xl uppercase text-secondary flex items-center gap-3">
          <AlertTriangle className="text-red-500" size={32} />
          Pendências
        </h1>
        <p className="text-gray-500 mt-1">
          Avisos sobre ações que podem impactar seu caixa ou o repasse de comissões.
        </p>
      </header>

      {/* Ativas */}
      {ativas.length === 0 ? (
        <Card className="bg-gray-50/50 border-dashed border-2 flex flex-col items-center justify-center p-12 text-center">
          <CheckCircle2 size={48} className="text-green-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-600">Tudo limpo por aqui!</h2>
          <p className="text-gray-400 mt-2">Nenhuma pendência ativa no momento.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-bold uppercase tracking-wider text-gray-400">
            {ativas.length} {ativas.length === 1 ? 'pendência ativa' : 'pendências ativas'}
          </p>
          {ativas.map((pendencia) => (
            <Card
              key={pendencia.id}
              className={`border-l-4 ${pendencia.severidade === 'alta' ? 'border-l-red-500' : 'border-l-orange-400'}`}
            >
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                        pendencia.severidade === 'alta'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {pendencia.severidade === 'alta' ? 'Alta' : 'Média'}
                    </span>
                    <span className="text-sm font-bold text-gray-800">{pendencia.tipo}</span>
                    <span className="text-xs text-gray-400 sm:ml-auto">
                      {new Date(pendencia.data).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{pendencia.descricao}</p>
                  <Link
                    to={`/os/${pendencia.osId}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-[#E55A15] transition-colors"
                  >
                    Ver OS <ChevronRight size={16} />
                  </Link>
                </div>

                <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                  <Button
                    onClick={() => handleResolver(pendencia.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Resolvido
                  </Button>
                  <Button
                    onClick={() => handleDescartar(pendencia.id)}
                    variant="outline"
                    className="flex-1 text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Ignorar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resolvidas */}
      {resolvidas.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-sm font-bold uppercase tracking-wider text-gray-300">
            {resolvidas.length} {resolvidas.length === 1 ? 'resolvida' : 'resolvidas'}
          </p>
          {resolvidas.map((pendencia) => (
            <Card key={pendencia.id} className="border-l-4 border-l-green-400 opacity-60">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-600">{pendencia.tipo}</p>
                  <p className="text-xs text-gray-400">{pendencia.descricao}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

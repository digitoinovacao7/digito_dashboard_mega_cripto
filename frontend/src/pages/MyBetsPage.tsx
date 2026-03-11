import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ExternalLink, Trophy } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getUserStats } from '../api/bridge';
import type { UserStats } from '../api/bridge';

export default function MyBetsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      getUserStats(user.email).then((res) => {
        setData(res);
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto py-10 animate-fade-in">
      <h1 className="text-3xl font-heading font-bold mb-10">Minhas Apostas</h1>
      <div className="grid gap-4">
        {loading ? (
          <div className="bg-bg-surface/50 border border-border-subtle rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px]">
            <Loader2 className="w-8 h-8 text-text-disabled animate-spin mb-4" />
            <p className="text-text-secondary text-sm">Carregando suas apostas...</p>
          </div>
        ) : data?.tickets.length === 0 ? (
          <div className="bg-bg-surface/50 border border-border-subtle rounded-2xl p-10 flex flex-col items-center justify-center text-center">
            <Trophy className="w-12 h-12 text-accent-gold/50 mb-4" />
            <h2 className="text-xl font-bold font-heading mb-2 text-text-primary">Nenhuma aposta encontrada</h2>
            <p className="text-text-secondary mb-6 max-w-sm">
              Você ainda não fez nenhuma aposta. Que tal tentar a sorte no próximo concurso?
            </p>
            <Link
              to="/jogar"
              className="bg-cta-primary hover:bg-cta-primary/80 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-cta-primary/20 cursor-pointer"
            >
              Jogar Agora
            </Link>
          </div>
        ) : (
          data?.tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`bg-bg-surface/50 border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors ${
                ticket.status === 'Premiado'
                  ? 'border-cta-primary/50 bg-cta-primary/5 shadow-success'
                  : ticket.status === 'Não Premiado'
                  ? 'border-border-subtle opacity-60'
                  : 'border-border-subtle hover:border-border-subtle'
              }`}
            >
              <div className="w-full">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className={`px-3 py-1 font-semibold text-xs uppercase tracking-wider rounded-lg border ${
                    ticket.status === 'Aguardando Sorteio'
                      ? 'bg-primary-accent/20 text-primary-accent border-primary-accent/20'
                      : ticket.status === 'Premiado'
                      ? 'bg-cta-primary/20 text-cta-primary border-cta-primary/30'
                      : 'bg-bg-surface text-text-secondary border-border-subtle'
                  }`}>
                    {ticket.status}
                  </span>
                  <span className="text-sm font-mono text-text-secondary">Concurso #{ticket.drawId}</span>
                  {ticket.verifiedAt && (
                    <span className="text-xs text-text-disabled">Verificado às {ticket.verifiedAt}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {ticket.numbers.map((n, i) => (
                    <span
                      key={i}
                      className={`text-xs font-mono font-bold w-7 h-7 flex items-center justify-center rounded-full border ${
                        ticket.status === 'Não Premiado'
                          ? 'bg-bg-surface text-text-disabled border-border-subtle'
                          : 'bg-bg-surface text-text-primary border-border-subtle'
                      }`}
                    >
                      {n.toString().padStart(2, '0')}
                    </span>
                  ))}
                </div>

                {/* Exibe o prêmio quando o ticket é premiado */}
                {ticket.status === 'Premiado' && ticket.prizeAmountBRL != null && (
                  <div className="flex items-center gap-2 mt-2 bg-cta-primary/10 border border-cta-primary/30 px-4 py-2 rounded-xl w-fit">
                    <Trophy className="w-4 h-4 text-cta-primary" />
                    <span className="text-cta-primary font-bold text-sm">
                      Prêmio: R$ {ticket.prizeAmountBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} → enviado ao seu PIX!
                    </span>
                  </div>
                )}
              </div>

              <div className="shrink-0">
                {ticket.solanaTx ? (
                  <a
                    href={ticket.solanaTx}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-bg-surface hover:bg-primary-accent/20 hover:text-primary-accent hover:border-primary-accent text-text-primary border border-border-subtle px-4 py-2 rounded-xl text-sm transition-all w-full md:w-auto"
                  >
                    Ver na Blockchain <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 bg-bg-surface/50 text-text-disabled border border-border-subtle px-4 py-2 rounded-xl text-sm cursor-not-allowed w-full md:w-auto"
                  >
                    Registrando... <Loader2 className="w-4 h-4 animate-spin" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
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
          <div className="bg-bg-surface/50 border border-border-subtle rounded-2xl p-6 text-center text-text-secondary">
            Você ainda não fez nenhuma aposta.
          </div>
        ) : (
          data?.tickets.map((ticket) => (
            <div key={ticket.id} className={`bg-bg-surface/50 border border-border-subtle rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-border-subtle transition-colors ${ticket.status === 'Não Premiado' ? 'opacity-70 bg-bg-surface/50' : ''}`}>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 font-semibold text-xs uppercase tracking-wider rounded-lg border ${ticket.status === 'Aguardando Sorteio' ? 'bg-primary-accent/20 text-primary-accent border-primary-accent/20' : ticket.status === 'Premiado' ? 'bg-cta-primary/20 text-cta-primary border-cta-primary/20' : 'bg-bg-surface text-text-secondary border-border-subtle'}`}>
                    {ticket.status}
                  </span>
                  <span className="text-sm font-mono text-text-secondary">Concurso #{ticket.drawId}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ticket.numbers.map((n, i) => (
                    <span key={i} className={`text-xs font-mono font-bold bg-bg-surface w-6 h-6 flex items-center justify-center rounded ${ticket.status === 'Não Premiado' ? 'text-text-disabled' : 'text-text-primary'}`}>
                      {n.toString().padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-auto text-right flex flex-col items-center md:items-end gap-2 shrink-0">
                <p className="text-sm text-text-secondary">Valor: R$ 2,50</p>
                {ticket.status === 'Premiado' && <p className="text-sm text-cta-primary">Prêmio: R$ 1.234,56</p>}
                {ticket.verifiedAt && <span className="text-sm text-text-secondary">Verificado às {ticket.verifiedAt}</span>}
                <button className="flex items-center justify-center gap-2 bg-bg-surface hover:bg-primary-accent/20 hover:text-primary-accent hover:border-primary-accent text-text-primary border border-border-subtle px-4 py-2 rounded-xl text-sm transition-all w-full md:w-auto h-fit">
                  Ver na Blockchain <ExternalLink className="w-4 h-4"/>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

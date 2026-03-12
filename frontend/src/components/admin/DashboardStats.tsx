import { BarChart3, Wallet, Users } from 'lucide-react';
import type { AdminStats } from '../../api/bridge';

interface DashboardStatsProps {
  stats: AdminStats | null;
  loading: boolean;
}

export default function DashboardStats({ stats, loading }: DashboardStatsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-bg-surface border-t-2 border-accent-gold p-6 rounded-xl shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform min-h-[140px]">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <BarChart3 className="w-20 h-20 text-accent-gold" />
        </div>
        <div className="flex items-center gap-3 text-text-secondary mb-4 relative z-10">
          <BarChart3 className="w-5 h-5 text-accent-gold" />
          <h3 className="font-semibold">Volume (Concurso Atual)</h3>
        </div>
        {loading ? <div className="animate-pulse bg-bg-surface h-10 w-3/4 rounded mb-2"></div> : (
          <div className="text-4xl font-black font-heading tracking-tight text-text-primary mb-2 relative z-10">
            R$ {stats?.volumeBRL.toFixed(2).replace('.', ',')}
          </div>
        )}
        {loading ? <div className="animate-pulse bg-bg-surface h-4 w-1/2 rounded"></div> : (
          <p className="text-sm text-text-secondary relative z-10">{stats?.totalTickets} bilhetes emitidos</p>
        )}
      </div>

      <div className="bg-bg-surface border-t-2 border-primary-accent p-6 rounded-xl shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform min-h-[140px]">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Wallet className="w-20 h-20 text-primary-accent" />
        </div>
        <div className="flex items-center gap-3 text-text-secondary mb-4 relative z-10">
          <Wallet className="w-5 h-5 text-primary-accent" />
          <h3 className="font-semibold">Gas Pool (Solana)</h3>
        </div>
        {loading ? <div className="animate-pulse bg-bg-surface h-10 w-3/4 rounded mb-2"></div> : (
          <div className="text-4xl font-black font-heading tracking-tight text-text-primary mb-2 relative z-10">
            {stats?.gasPoolSOL} SOL
          </div>
        )}
        {loading ? <div className="animate-pulse bg-bg-surface h-4 w-1/2 rounded"></div> : (
          <p className="text-sm text-text-secondary relative z-10">Suficiente para ~{(stats?.gasTxCapacity || 0) / 1000}k apostas</p>
        )}
      </div>

      <div className="bg-bg-surface border-t-2 border-border-subtle p-6 rounded-xl shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform min-h-[140px]">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Users className="w-20 h-20 text-text-secondary" />
        </div>
        <div className="flex items-center gap-3 text-text-secondary mb-4 relative z-10">
          <Users className="w-5 h-5 text-text-secondary" />
          <h3 className="font-semibold">Novos Cadastros</h3>
        </div>
        {loading ? <div className="animate-pulse bg-bg-surface h-10 w-3/4 rounded mb-2"></div> : (
          <div className="text-4xl font-black font-heading tracking-tight text-text-primary mb-2 relative z-10">
            {stats?.newRegistrations24h}
          </div>
        )}
        {loading ? <div className="animate-pulse bg-bg-surface h-4 w-1/2 rounded"></div> : (
          <p className="text-sm text-text-secondary relative z-10">Últimas 24 horas</p>
        )}
      </div>
    </div>
  );
}

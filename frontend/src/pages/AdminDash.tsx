import { useEffect, useState } from 'react';
import { BarChart3, Wallet, Users, AlertTriangle, Lock, ShieldAlert, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../api/bridge';
import type { AdminStats } from '../api/bridge';
import DrawManagement from '../components/admin/DrawManagement';
import UserManagement from '../components/admin/UserManagement';
import FinancialMonitoring from '../components/admin/FinancialMonitoring';
import PlatformSettings from '../components/admin/PlatformSettings';

export default function AdminDash() {
  const { user, isAdmin, login } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      getAdminStats().then((data) => {
        setStats(data);
        setLoading(false);
      });
    }
  }, [isAdmin]);

  // Se não estiver logado, exibe a tela de Login Administrativo
  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-20">
        <div className="bg-bg-surface border-2 border-border-subtle rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-accent to-transparent opacity-50"></div>
          
          <div className="w-20 h-20 bg-bg-base rounded-full flex items-center justify-center mx-auto mb-6 border border-border-subtle">
             <Lock className="w-10 h-10 text-text-secondary" />
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">Acesso Restrito</h1>
          <p className="text-text-secondary mb-8">Esta área é reservada apenas para o administrador do contrato inteligente.</p>
          
          <button 
            onClick={login}
            className="w-full flex items-center justify-center gap-3 bg-text-primary hover:bg-text-secondary text-bg-base font-bold py-4 px-8 rounded-xl transition-all"
          >
            <LogIn className="w-5 h-5" /> Entrar como Administrador
          </button>
        </div>
      </div>
    );
  }

  // Se estiver logado, mas o email não estiver na lista de admins
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <ShieldAlert className="w-24 h-24 text-feedback-error mx-auto mb-6 opacity-80" />
        <h1 className="text-4xl font-heading font-bold text-text-primary mb-4">Acesso Negado</h1>
        <p className="text-text-secondary mb-8 text-lg">
          A conta <span className="text-accent-gold font-mono">{user.email}</span> não tem privilégios de administrador para acessar o Painel de Controle.
        </p>
        <Link 
          to="/"
          className="bg-bg-surface hover:brightness-125 text-text-primary font-bold py-3 px-8 rounded-full transition-colors border border-border-subtle inline-block"
        >
          Voltar para Home
        </Link>
      </div>
    );
  }

  // Se passou pelas barreiras, mostra o Painel
  return (
    <div className="max-w-6xl mx-auto py-10 animate-fade-in space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-feedback-error/10 text-feedback-error text-xs font-bold font-mono border border-feedback-error/20 mb-3 shadow-error">
            <Lock className="w-3 h-3" /> ADMIN SYSTEM BOUNDARY
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">MegaCripto Controller</h1>
          <p className="text-text-secondary">Gerenciamento On-Chain e Saúde Financeira</p>
        </div>
        <div className="text-left md:text-right bg-bg-surface/50 p-4 rounded-xl border border-border-subtle">
          <div className="text-sm text-text-secondary mb-1 flex items-center gap-2">
            Autenticado como: <span className="text-accent-gold font-mono text-xs">{user.email}</span>
          </div>
          <div className="text-feedback-success font-mono font-bold flex items-center md:justify-end gap-2 text-sm mt-2">
            <div className="w-2 h-2 rounded-full bg-feedback-success animate-pulse w-max"></div> Master Wallet Sincronizada
          </div>
        </div>
      </div>

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
      
      <DrawManagement />
      <UserManagement />
      <FinancialMonitoring />
      <PlatformSettings />

      {/* Danger Zone */}
      <div className="border border-feedback-error/50 bg-feedback-error/10 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 opacity-5">
           <AlertTriangle className="w-96 h-96 text-feedback-error" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="text-feedback-error w-6 h-6 animate-pulse" />
            <h2 className="text-xl font-bold text-text-primary uppercase tracking-widest text-sm">Câmara de Sorteio (Multi-Sig)</h2>
          </div>
          
          <p className="text-text-secondary leading-relaxed mb-6 max-w-3xl">
            Acionar esta função encerra o recebimento de novas apostas no contrato inteligente e consulta o Oráculo Web3 (Switchboard/VRF) para gerar a sequência matemática vencedora determinística. <strong className="text-text-primary">Esta ação é irreversível e custa taxas na rede Solana.</strong>
          </p>

          <div className="flex flex-col xl:flex-row gap-4 items-center p-6 bg-bg-surface/80 rounded-2xl border border-border-subtle shadow-inner">
            <div className="flex-1 flex flex-wrap gap-2 w-full">
              <div className="px-4 py-2 rounded bg-feedback-success/10 text-feedback-success font-mono text-xs border border-feedback-success/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-feedback-success"></span> Assinatura 1: Sua Conta
              </div>
              <div className="px-4 py-2 rounded bg-bg-surface/80 text-text-disabled font-mono text-xs border border-border-subtle border-dashed">
                Assinatura 2: Sócia Pendente
              </div>
              <div className="px-4 py-2 rounded bg-bg-surface/80 text-text-disabled font-mono text-xs border border-border-subtle border-dashed">
                Assinatura 3: Cold Wallet Pendente
              </div>
            </div>
            
            <button 
                disabled={loading}
                className="w-full xl:w-auto bg-feedback-error hover:brightness-110 text-text-primary font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-error whitespace-nowrap opacity-50 cursor-not-allowed border border-feedback-error/50 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Lock className="w-4 h-4" />}
              {loading ? "Sincronizando..." : `Executar Sorteio #${stats?.currentDrawId}`}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

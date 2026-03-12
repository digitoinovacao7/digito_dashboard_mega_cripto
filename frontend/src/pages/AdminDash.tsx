import { useEffect, useState } from 'react';
import { Lock, ShieldAlert, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { getAdminStats, triggerDraw } from '../api/bridge';
import type { AdminStats } from '../api/bridge';
import DrawManagement from '../components/admin/DrawManagement';
import UserManagement from '../components/admin/UserManagement';
import FinancialMonitoring from '../components/admin/FinancialMonitoring';
import PlatformSettings from '../components/admin/PlatformSettings';
import NextDrawSettings from '../components/admin/NextDrawSettings';
import SupportTicketManagement from '../components/admin/SupportTicketManagement';
import DashboardStats from '../components/admin/DashboardStats';
import AdminHeader from '../components/admin/AdminHeader';
import DrawTrigger from '../components/admin/DrawTrigger';
import Tabs from '../components/admin/Tabs';

export default function AdminDash() {
  const { user, isAdmin, login } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTriggeringDraw, setIsTriggeringDraw] = useState(false);

  const handleTriggerDraw = async () => {
    setIsTriggeringDraw(true);
    try {
      const newStats = await triggerDraw();
      setStats(newStats);
    } catch (error) {
      alert("Houve um erro ao acionar o sorteio. Tente novamente.");
    } finally {
      setIsTriggeringDraw(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      getAdminStats().then((data) => {
        setStats(data);
        setLoading(false);
      });
    }
  }, [isAdmin]);

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

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <ShieldAlert className="w-24 h-24 text-feedback-error mx-auto mb-6 opacity-80" />
        <h1 className="text-4xl font-heading font-bold text-text-primary mb-4">Acesso Negado</h1>
        <p className="text-text-secondary mb-8 text-lg">
          A conta <span className="text-accent-gold font-mono">{user.email}</span> não tem privilégios de administrador.
        </p>
        <Link to="/" className="bg-bg-surface hover:brightness-125 text-text-primary font-bold py-3 px-8 rounded-full transition-colors border border-border-subtle inline-block">
          Voltar para Home
        </Link>
      </div>
    );
  }

  const tabs = [
    {
      label: 'Dashboard',
      content: (
        <div className="space-y-12">
          <DashboardStats stats={stats} loading={loading} />
          <FinancialMonitoring />
        </div>
      )
    },
    {
      label: 'Sorteios',
      content: (
        <div className="space-y-12">
          <NextDrawSettings />
          <DrawManagement />
          <DrawTrigger 
            currentDrawId={stats?.currentDrawId}
            loading={loading}
            isTriggeringDraw={isTriggeringDraw}
            onTriggerDraw={handleTriggerDraw}
          />
        </div>
      )
    },
    { label: 'Usuários', content: <UserManagement /> },
    { label: 'Configurações', content: <PlatformSettings /> },
    { label: 'Suporte', content: <SupportTicketManagement /> }
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 animate-fade-in space-y-12">
      <AdminHeader email={user.email || ''} />
      <Tabs tabs={tabs} />
    </div>
  );
}

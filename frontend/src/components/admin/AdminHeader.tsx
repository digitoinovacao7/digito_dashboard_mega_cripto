import { Lock } from 'lucide-react';

interface AdminHeaderProps {
  email: string;
}

export default function AdminHeader({ email }: AdminHeaderProps) {
  return (
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
          Autenticado como: <span className="text-accent-gold font-mono text-xs">{email}</span>
        </div>
        <div className="text-feedback-success font-mono font-bold flex items-center md:justify-end gap-2 text-sm mt-2">
          <div className="w-2 h-2 rounded-full bg-feedback-success animate-pulse w-max"></div> Master Wallet Sincronizada
        </div>
      </div>
    </div>
  );
}

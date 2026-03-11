import { ArrowUpRight, ArrowDownRight, DollarSign, PiggyBank, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAdminStats, type AdminStats } from '../../api/bridge';

export default function FinancialMonitoring() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    getAdminStats().then(setStats);
  }, []);

  if (!stats) return null;

  const totalVolume = stats.volumeBRL;
  const prizePoolPercentage = stats.globalPrizePoolPercentage || 60; // default 60%
  const houseEdgePercentage = 100 - prizePoolPercentage;
  
  const prizePoolBRL = totalVolume * (prizePoolPercentage / 100);
  const grossRevenue = totalVolume * (houseEdgePercentage / 100);
  
  // Estimation of costs (e.g., 1.5% for PIX + infra)
  const estimatedCosts = totalVolume * 0.015; 
  const netProfit = grossRevenue - estimatedCosts;

  return (
    <div className="bg-bg-surface border-t-2 border-border-subtle p-6 rounded-xl shadow-lg mt-6 relative overflow-hidden">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><DollarSign /> Tesouraria e Faturamento</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pote de Prêmios */}
        <div className="p-4 bg-bg-base/50 rounded-xl border border-border-subtle hover:border-accent-gold transition-colors group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Acumulado para Prêmio</p>
              <h3 className="text-2xl font-black font-heading mt-1 text-text-primary">
                R$ {prizePoolBRL.toFixed(2).replace('.', ',')}
              </h3>
            </div>
            <div className="bg-accent-gold/10 p-2 rounded-lg text-accent-gold">
               <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs mt-3 text-text-secondary">
             <span className="bg-bg-surface px-2 py-1 rounded text-accent-gold font-bold mr-2">{prizePoolPercentage}%</span> do Volume
          </div>
        </div>

        {/* Receita Bruta da Casa */}
        <div className="p-4 bg-bg-base/50 rounded-xl border border-border-subtle hover:border-primary-accent transition-colors group">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Receita da Casa (Bruta)</p>
              <h3 className="text-2xl font-black font-heading mt-1 text-text-primary">
                R$ {grossRevenue.toFixed(2).replace('.', ',')}
              </h3>
            </div>
            <div className="bg-primary-accent/10 p-2 rounded-lg text-primary-accent">
               <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs mt-3 text-text-secondary">
             <span className="bg-bg-surface px-2 py-1 rounded text-primary-accent font-bold mr-2">{houseEdgePercentage}%</span> do Volume
          </div>
        </div>

        {/* Custos Estimados */}
        <div className="p-4 bg-bg-base/50 rounded-xl border border-border-subtle">
           <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Custos Estimados</p>
              <h3 className="text-2xl font-black font-heading mt-1 text-feedback-error">
                - R$ {estimatedCosts.toFixed(2).replace('.', ',')}
              </h3>
            </div>
             <div className="bg-feedback-error/10 p-2 rounded-lg text-feedback-error">
               <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs mt-3 text-text-secondary">
             ~1.5% (PIX, Infra, Solana)
          </div>
        </div>

        {/* Lucro Líquido Estimado */}
        <div className="p-4 bg-black rounded-xl border border-feedback-success shadow-[0_0_15px_rgba(74,222,128,0.1)] relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <DollarSign className="w-20 h-20 text-feedback-success" />
           </div>
           <div className="flex justify-between items-start mb-2 relative z-10">
            <div>
              <p className="text-xs text-feedback-success/80 font-bold uppercase tracking-wider">Lucro Líquido Realizado</p>
              <h3 className="text-2xl font-black font-heading mt-1 text-feedback-success">
                R$ {netProfit.toFixed(2).replace('.', ',')}
              </h3>
            </div>
             <div className="bg-feedback-success/20 p-2 rounded-lg text-feedback-success">
               <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs mt-3 text-text-disabled relative z-10">
             Disponível para Saque do Admin
          </div>
        </div>
      </div>
    </div>
  );
}

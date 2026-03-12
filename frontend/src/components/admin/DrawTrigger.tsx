import { AlertTriangle, Loader2, Lock } from 'lucide-react';

interface DrawTriggerProps {
  currentDrawId?: string;
  loading: boolean;
  isTriggeringDraw: boolean;
  onTriggerDraw: () => void;
}

export default function DrawTrigger({ currentDrawId, loading, isTriggeringDraw, onTriggerDraw }: DrawTriggerProps) {
  return (
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
              onClick={onTriggerDraw}
              disabled={loading || isTriggeringDraw}
              className="w-full xl:w-auto bg-feedback-error hover:brightness-110 text-text-primary font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-error whitespace-nowrap border border-feedback-error/50 flex items-center justify-center gap-3"
          >
            {isTriggeringDraw ? <Loader2 className="w-4 h-4 animate-spin"/> : <Lock className="w-4 h-4" />}
            {isTriggeringDraw ? "Sorteando..." : `Executar Sorteio #${currentDrawId}`}
          </button>
        </div>
      </div>
    </div>
  );
}

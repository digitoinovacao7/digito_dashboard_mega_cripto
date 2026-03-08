import { BarChart3, Wallet, Users, AlertTriangle, Lock } from 'lucide-react';

export default function AdminDash() {
  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-500/10 text-red-500 text-xs font-bold font-mono border border-red-500/20 mb-3">
            <Lock className="w-3 h-3" /> ADMIN SYSTEM BOUNDARY
          </div>
          <h1 className="text-3xl font-heading font-bold mb-2">MegaCripto Controller</h1>
          <p className="text-slate-400">Gerenciamento On-Chain e Saúde Financeira</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">Master Wallet Status</div>
          <div className="text-green-400 font-mono font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div> Sincronizado
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-800 border-t-2 border-brand-accent p-6 rounded-xl">
          <div className="flex items-center gap-3 text-slate-300 mb-4">
            <BarChart3 className="w-5 h-5 text-brand-accent" />
            <h3 className="font-semibold">Volume (Concurso Atual)</h3>
          </div>
          <div className="text-4xl font-black font-heading tracking-tight text-white mb-2">
            R$ 4.250,00
          </div>
          <p className="text-sm text-slate-400">850 bilhetes emitidos</p>
        </div>

        <div className="bg-slate-800 border-t-2 border-brand-web3 p-6 rounded-xl">
          <div className="flex items-center gap-3 text-slate-300 mb-4">
            <Wallet className="w-5 h-5 text-brand-web3" />
            <h3 className="font-semibold">Gas Pool (Solana)</h3>
          </div>
          <div className="text-4xl font-black font-heading tracking-tight text-white mb-2">
            12.45 SOL
          </div>
          <p className="text-sm text-slate-400">Suficiente para ~150k apostas</p>
        </div>

        <div className="bg-slate-800 border-t-2 border-slate-500 p-6 rounded-xl">
          <div className="flex items-center gap-3 text-slate-300 mb-4">
            <Users className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold">Novos Cadastros</h3>
          </div>
          <div className="text-4xl font-black font-heading tracking-tight text-white mb-2">
            142
          </div>
          <p className="text-sm text-slate-400">Últimas 24 horas</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-900/50 bg-red-900/10 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="text-red-500 w-6 h-6" />
          <h2 className="text-xl font-bold text-red-100">Câmara de Sorteio (Multi-Sig)</h2>
        </div>
        
        <p className="text-sm text-slate-400 mb-6 max-w-3xl">
          Acionar esta função encerra o recebimento de novas apostas no contrato inteligente e consulta o Oráculo Web3 (Switchboard/VRF) para gerar a sequência matemática vencedora determinística.
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800">
          <div className="flex-1 flex gap-2">
            <div className="px-4 py-2 rounded bg-green-500/20 text-green-400 font-mono text-xs border border-green-500/30">
              Assinatura 1: Confirmada
            </div>
            <div className="px-4 py-2 rounded bg-slate-800 text-slate-400 font-mono text-xs border border-slate-700">
              Assinatura 2: Pendente
            </div>
            <div className="px-4 py-2 rounded bg-slate-800 text-slate-400 font-mono text-xs border border-slate-700">
              Assinatura 3: Pendente
            </div>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-red-900/20 whitespace-nowrap opacity-50 cursor-not-allowed">
            Executar Sorteio #001
          </button>
        </div>
      </div>

    </div>
  );
}

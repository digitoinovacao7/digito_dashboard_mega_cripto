import { FileSignature, ShieldAlert, KeyRound, ExternalLink } from 'lucide-react';

export default function UserDash() {
  return (
    <div className="max-w-5xl mx-auto py-10">
      
      <div className="mb-10">
        <h1 className="text-3xl font-heading font-bold mb-2">Meu Painel</h1>
        <p className="text-slate-400">Acompanhe seus bilhetes e sua identidade descentralizada.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Transparent Wallet */}
        <div className="md:col-span-1 bg-gradient-to-br from-brand-web3/20 to-slate-800 border border-brand-web3/30 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-web3/20 rounded-xl text-brand-web3">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Carteira Transparente</h2>
              <p className="text-xs text-brand-web3 font-mono">Connected</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Blockchain PubKey</p>
              <p className="font-mono text-sm text-slate-300 bg-slate-900/50 p-2 rounded truncate border border-slate-700">
                DxL9c...8uF2
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Pix para Recebimento</p>
              <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded border border-slate-700">
                <span className="font-mono text-brand-pix">antonio@example.com</span>
                <button className="text-xs text-slate-400 hover:text-white underline">Editar</button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-center">
            <h3 className="text-xl font-heading font-bold mb-2 flex items-center gap-2">
              <ShieldAlert className="text-brand-accent w-5 h-5"/> Por que meus dados estão seguros?
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Ao vincular sua conta Google, o sistema cria uma chave isolada exclusiva para você (via MPC). Nós não conseguimos acessar sua chave privada. Todos os pagamentos automáticos são vinculados on-chain de forma transparente para o seu Pix.
            </p>
        </div>
      </div>

      {/* Tickets Database */}
      <div>
        <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2">
          <FileSignature className="text-slate-400"/> Meus Bilhetes
        </h2>

        <div className="grid gap-4">
          {/* Item */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-slate-500 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-brand-accent/20 text-brand-accent font-semibold text-xs uppercase tracking-wider rounded-lg border border-brand-accent/20">
                  Aguardando Sorteio
                </span>
                <span className="text-sm font-mono text-slate-400">Concurso #001</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {[2, 4, 11, 15, 16, 20, 21, 22, 23, 24].map(n => (
                  <span key={n} className="text-xs font-mono font-bold bg-slate-900 text-slate-300 w-6 h-6 flex items-center justify-center rounded">
                    {n.toString().padStart(2, '0')}
                  </span>
                ))}
                <span className="text-xs font-mono font-bold bg-slate-900 text-slate-500 w-6 h-6 flex items-center justify-center rounded">...</span>
              </div>
            </div>
            
            <div className="w-full md:w-auto text-right flex flex-col items-center md:items-end gap-2">
              <span className="text-sm text-slate-400">Verificado às 20:34</span>
              <button className="flex items-center gap-2 bg-slate-700 hover:bg-brand-web3/20 hover:text-brand-web3 hover:border-brand-web3 text-white border border-slate-600 px-4 py-2 rounded-xl text-sm transition-all w-full md:w-auto h-fit">
                Verificador Pericial <ExternalLink className="w-4 h-4"/>
              </button>
            </div>
          </div>
          
          {/* Old Item */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 opacity-70">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-slate-800 text-slate-400 font-semibold text-xs uppercase tracking-wider rounded-lg border border-slate-700">
                  Não Premiado
                </span>
                <span className="text-sm font-mono text-slate-500">Concurso #000</span>
              </div>
              <div className="flex gap-1 text-slate-500">
                15 Números Escolhidos
              </div>
            </div>
            <button className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 text-sm transition-all w-full md:w-auto h-fit">
               Ver na Blockchain <ExternalLink className="w-4 h-4"/>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

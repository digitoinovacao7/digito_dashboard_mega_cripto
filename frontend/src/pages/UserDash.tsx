import { useState, useEffect } from 'react';
import { FileSignature, ShieldAlert, KeyRound, ExternalLink, Edit2, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getUserStats } from '../api/bridge';
import type { UserStats } from '../api/bridge';
import QuickBet from '../components/QuickBet';
import { Link } from 'react-router-dom';

export default function UserDash() {
  const { user } = useAuth();
  const [isEditingPix, setIsEditingPix] = useState(false);
  const [pixKey, setPixKey] = useState(user?.email || "");
  const [data, setData] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      getUserStats(user.email).then((res) => {
        setData(res);
        if (!pixKey && res.pubKey) setPixKey(user.email); // Just simulating
        setLoading(false);
      });
    }
  }, [user]);

  const handleSavePix = () => {
    setIsEditingPix(false);
    // TODO: Aqui vamos amarrar a chamada pro Backend (Rust) para salvar na Blockchain/DB
  };

  const activeBets = data?.tickets.filter(ticket => ticket.status === 'Aguardando Sorteio');

  return (
    <div className="max-w-5xl mx-auto py-10 animate-fade-in">
      
      <div className="mb-10">
        <h1 className="text-3xl font-heading font-bold mb-2">Olá, {user?.email}!</h1>
        <p className="text-slate-400">Acompanhe seus bilhetes e sua identidade descentralizada.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <QuickBet />
        <div className="md:col-span-1 bg-gradient-to-br from-brand-web3/10 to-slate-800 border border-brand-web3/30 shadow-[0_0_30px_rgba(139,92,246,0.1)] rounded-3xl p-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-shadow duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <KeyRound className="w-32 h-32 text-brand-web3" />
          </div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-3 bg-brand-web3/20 rounded-xl text-brand-web3 border border-brand-web3/30">
              <KeyRound className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Carteira Transparente</h2>
              <p className="text-xs text-brand-web3 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-web3 inline-block"></span>
                Connected
              </p>
            </div>
          </div>
          
          <div className="space-y-5 relative z-10 min-h-[120px]">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Blockchain PubKey</p>
              {loading ? <div className="animate-pulse bg-slate-700 h-9 w-full rounded-lg"></div> : (
                <p className="font-mono text-sm text-slate-300 bg-slate-900 p-2.5 rounded-lg truncate border border-slate-700 shadow-inner">
                  {user?.pubkey || data?.pubKey || "Aguardando..."}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Pix para Recebimento</p>
              <div className={`flex justify-between items-center bg-slate-900 p-1.5 rounded-lg border shadow-inner transition-colors duration-300 ${isEditingPix ? 'border-brand-web3' : 'border-slate-700 hover:border-slate-500'}`}>
                {isEditingPix ? (
                  <input 
                    type="text" 
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSavePix()}
                    className="bg-transparent border-none outline-none font-mono text-brand-pix w-full text-sm pl-2"
                    placeholder="Sua chave PIX..."
                    autoFocus
                  />
                ) : (
                  <span className="font-mono text-brand-pix truncate pr-2 w-full pl-2 text-sm select-all">{pixKey}</span>
                )}
                
                <button 
                  onClick={() => isEditingPix ? handleSavePix() : setIsEditingPix(true)} 
                  className={`p-2 ml-2 rounded-md transition-colors shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${isEditingPix ? 'bg-brand-pix/20 text-brand-pix hover:bg-brand-pix/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                >
                  {isEditingPix ? <><Check className="w-3 h-3" /> Salvar</> : <><Edit2 className="w-3 h-3" /> Editar</>}
                </button>
              </div>
              
              {isEditingPix && (
                <p className="text-[10px] text-brand-web3 mt-1.5 animate-fade-in text-right">
                  Aperte Enter para salvar.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Bets */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
            <FileSignature className="text-slate-400"/> Apostas Ativas
          </h2>
          <Link to="/minhas-apostas" className="text-brand-accent hover:underline">Ver todas</Link>
        </div>

        <div className="grid gap-4 mb-12">
          {loading ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[120px]">
               <Loader2 className="w-8 h-8 text-slate-500 animate-spin mb-4" />
               <p className="text-slate-400 text-sm">Carregando jogos registrados na rede...</p>
            </div>
          ) : activeBets?.length === 0 ? (
             <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center text-slate-400">
               Você ainda não possui bilhetes registrados neste ciclo.
             </div>
          ) : (
            activeBets?.slice(0, 3).map((ticket) => (
              <div key={ticket.id} className={`bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-slate-500 transition-colors`}>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 font-semibold text-xs uppercase tracking-wider rounded-lg border bg-brand-accent/20 text-brand-accent border-brand-accent/20`}>
                      {ticket.status}
                    </span>
                    <span className="text-sm font-mono text-slate-400">Concurso #{ticket.drawId}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ticket.numbers.slice(0, 10).map((n, i) => (
                      <span key={i} className={`text-xs font-mono font-bold bg-slate-900 w-6 h-6 flex items-center justify-center rounded text-slate-300`}>
                        {n.toString().padStart(2, '0')}
                      </span>
                    ))}
                    {ticket.numbers.length > 10 && (
                      <span className="text-xs font-mono font-bold bg-slate-900 text-slate-500 w-6 h-6 flex items-center justify-center rounded">...</span>
                    )}
                  </div>
                </div>
                
                <div className="w-full md:w-auto text-right flex flex-col items-center md:items-end gap-2 shrink-0">
                  {ticket.verifiedAt && <span className="text-sm text-slate-400">Verificado às {ticket.verifiedAt}</span>}
                  <button className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-brand-web3/20 hover:text-brand-web3 hover:border-brand-web3 text-white border border-slate-600 px-4 py-2 rounded-xl text-sm transition-all w-full md:w-auto h-fit">
                    Verificador Pericial <ExternalLink className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

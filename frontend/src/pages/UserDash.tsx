import { useState, useEffect } from 'react';
import { FileSignature, KeyRound, ExternalLink, Edit2, Check, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getUserStats, getUserSettings, updateUserSettings } from '../api/bridge';
import type { UserStats, UserSettingsOptions } from '../api/bridge';
import QuickBet from '../components/QuickBet';
import { Link } from 'react-router-dom';

export default function UserDash() {
  const { user } = useAuth();
  const [isEditingPix, setIsEditingPix] = useState(false);
  const [pixKey, setPixKey] = useState(user?.email || "");
  const [data, setData] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  // States for Responsible Gaming
  const [settings, setSettings] = useState<UserSettingsOptions | null>(null);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [limitInput, setLimitInput] = useState<string>('');

  useEffect(() => {
    if (user?.email) {
      Promise.all([
        getUserStats(user.email),
        getUserSettings(user.email)
      ]).then(([statsRes, settingsRes]) => {
        setData(statsRes);
        setSettings(settingsRes);
        setLimitInput(settingsRes.daily_limit_brl ? settingsRes.daily_limit_brl.toString() : '');
        if (!pixKey && statsRes.pubKey) setPixKey(user.email); // Just simulating
        setLoading(false);
      });
    }
  }, [user]);

  const handleToggleSelfExclusion = async () => {
    if (!user?.email || !settings) return;
    const confirm = window.confirm("ATENÇÃO: A autoexclusão é uma ação séria. Enquanto ativa, você NÃO poderá comprar nenhum bilhete. Deseja prosseguir?");
    if (!confirm) return;

    setIsUpdatingSettings(true);
    try {
      const updated = await updateUserSettings(user.email, !settings.is_self_excluded, undefined);
      setSettings(updated);
    } catch (e) {
      console.error(e);
      alert("Erro ao alterar modo de autoexclusão");
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const handleSaveLimit = async () => {
    if (!user?.email || !settings) return;
    setIsUpdatingSettings(true);
    try {
      const limitVal = limitInput === '' || Number(limitInput) <= 0 ? null : Number(limitInput);
      const updated = await updateUserSettings(user.email, undefined, limitVal);
      setSettings(updated);
      alert("Limite atualizado com sucesso.");
    } catch (e) {
      console.error(e);
      alert("Erro ao atualizar limite");
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const handleSavePix = () => {
    setIsEditingPix(false);
    // TODO: Aqui vamos amarrar a chamada pro Backend (Rust) para salvar na Blockchain/DB
  };

  const activeBets = data?.tickets.filter(ticket => ticket.status === 'Aguardando Sorteio');

  return (
    <div className="max-w-5xl mx-auto py-10 animate-fade-in">
      
      <div className="mb-10">
        <h1 className="text-3xl font-heading font-bold mb-2">Olá, {user?.email}!</h1>
        <p className="text-text-secondary">Acompanhe seus bilhetes e sua identidade descentralizada.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <QuickBet />
        <div className="md:col-span-1 bg-gradient-to-br from-primary-accent/10 to-bg-surface border border-primary-accent/30 shadow-primary-accent rounded-3xl p-6 relative overflow-hidden group hover:shadow-primary-accent/20 transition-shadow duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <KeyRound className="w-32 h-32 text-primary-accent" />
          </div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-3 bg-primary-accent/20 rounded-xl text-primary-accent border border-primary-accent/30">
              <KeyRound className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-text-primary">Carteira Transparente</h2>
              <p className="text-xs text-primary-accent font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-accent inline-block"></span>
                Connected
              </p>
            </div>
          </div>
          
          <div className="space-y-5 relative z-10 min-h-[120px]">
            <div>
              <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-1.5 font-bold">Blockchain PubKey</p>
              {loading ? <div className="animate-pulse bg-bg-surface h-9 w-full rounded-lg"></div> : (
                <p className="font-mono text-sm text-text-primary bg-bg-surface p-2.5 rounded-lg truncate border border-border-subtle shadow-inner">
                  {user?.pubkey || data?.pubKey || "Aguardando..."}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-1.5 font-bold">Pix para Recebimento</p>
              <div className={`flex justify-between items-center bg-bg-surface p-1.5 rounded-lg border shadow-inner transition-colors duration-300 ${isEditingPix ? 'border-primary-accent' : 'border-border-subtle hover:border-border-subtle'}`}>
                {isEditingPix ? (
                  <input 
                    type="text" 
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSavePix()}
                    className="bg-transparent border-none outline-none font-mono text-cta-primary w-full text-sm pl-2"
                    placeholder="Sua chave PIX..."
                    autoFocus
                  />
                ) : (
                  <span className="font-mono text-cta-primary truncate pr-2 w-full pl-2 text-sm select-all">{pixKey}</span>
                )}
                
                <button 
                  onClick={() => isEditingPix ? handleSavePix() : setIsEditingPix(true)} 
                  className={`p-2 ml-2 rounded-md transition-colors shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${isEditingPix ? 'bg-cta-primary/20 text-cta-primary hover:bg-cta-primary/30' : 'bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-surface'}`}
                >
                  {isEditingPix ? <><Check className="w-3 h-3" /> Salvar</> : <><Edit2 className="w-3 h-3" /> Editar</>}
                </button>
              </div>
              
              {isEditingPix && (
                <p className="text-[10px] text-primary-accent mt-1.5 animate-fade-in text-right">
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
            <FileSignature className="text-text-secondary"/> Apostas Ativas
          </h2>
          <Link to="/minhas-apostas" className="text-primary-accent hover:underline">Ver todas</Link>
        </div>

        <div className="grid gap-4 mb-12">
          {loading ? (
            <div className="bg-bg-surface/50 border border-border-subtle rounded-2xl p-6 flex flex-col items-center justify-center min-h-[120px]">
               <Loader2 className="w-8 h-8 text-text-disabled animate-spin mb-4" />
               <p className="text-text-secondary text-sm">Carregando jogos registrados na rede...</p>
            </div>
          ) : activeBets?.length === 0 ? (
             <div className="bg-bg-surface/50 border border-border-subtle rounded-2xl p-6 text-center text-text-secondary">
               Você ainda não possui bilhetes registrados neste ciclo.
             </div>
          ) : (
            activeBets?.slice(0, 3).map((ticket) => (
              <div key={ticket.id} className={`bg-bg-surface/50 border border-border-subtle rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-border-subtle transition-colors`}>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 font-semibold text-xs uppercase tracking-wider rounded-lg border bg-primary-accent/20 text-primary-accent border-primary-accent/20`}>
                      {ticket.status}
                    </span>
                    <span className="text-sm font-mono text-text-secondary">Concurso #{ticket.drawId}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {ticket.numbers.slice(0, 10).map((n, i) => (
                      <span key={i} className={`text-xs font-mono font-bold bg-bg-surface w-6 h-6 flex items-center justify-center rounded text-text-primary`}>
                        {n.toString().padStart(2, '0')}
                      </span>
                    ))}
                    {ticket.numbers.length > 10 && (
                      <span className="text-xs font-mono font-bold bg-bg-surface text-text-disabled w-6 h-6 flex items-center justify-center rounded">...</span>
                    )}
                  </div>
                </div>
                
                <div className="w-full md:w-auto text-right flex flex-col items-center md:items-end gap-2 shrink-0">
                  {ticket.verifiedAt && <span className="text-sm text-text-secondary">Verificado às {ticket.verifiedAt}</span>}
                  <button className="flex items-center justify-center gap-2 bg-bg-surface hover:bg-primary-accent/20 hover:text-primary-accent hover:border-primary-accent text-text-primary border border-border-subtle px-4 py-2 rounded-xl text-sm transition-all w-full md:w-auto h-fit">
                    Verificador Pericial <ExternalLink className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Jogo Responsável */}
      <div className="mt-12 bg-bg-surface/50 border border-border-subtle rounded-3xl p-8">
        <h2 className="text-2xl font-bold font-heading mb-6 flex items-center gap-2 text-text-primary">
          <ShieldAlert className="w-6 h-6 text-feedback-warning" /> Jogo Responsável
        </h2>
        <p className="text-text-secondary mb-8">
          A Mega Cripto preza pela sua saúde financeira. Use as ferramentas abaixo para ter controle absoluto sobre o impacto do jogo usando a tecnologia on-chain a seu favor, limitando transações a nível de servidor.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Limite Financeiro */}
          <div className="bg-bg-base/80 p-6 rounded-2xl border border-border-subtle">
             <h3 className="font-bold text-text-primary mb-2">Limite Máximo de Gasto Diário</h3>
             <p className="text-sm text-text-secondary mb-4">
               Defina o quanto você permite que o sistema libere em apostas via PIX hoje. Deixe zerado ou vazio para apostas livres.
             </p>
             <div className="flex gap-2">
                 <div className="relative flex-grow">
                     <span className="absolute left-3 top-2.5 text-text-secondary font-mono">R$</span>
                     <input 
                        type="number"
                        value={limitInput}
                        onChange={e => setLimitInput(e.target.value)}
                        className="w-full bg-bg-surface border border-border-subtle rounded-lg py-2 pl-9 pr-3 text-text-primary outline-none focus:border-primary-accent"
                        placeholder="Ex: 50"
                        disabled={isUpdatingSettings || loading}
                     />
                 </div>
                 <button 
                  onClick={handleSaveLimit}
                  disabled={isUpdatingSettings || loading}
                  className="bg-bg-surface hover:bg-border-subtle text-text-primary px-4 py-2 rounded-lg border border-border-subtle transition-colors"
                 >
                   Salvar
                 </button>
             </div>
          </div>

          {/* Autoexclusão temporária */}
          <div className="bg-bg-base/80 p-6 rounded-2xl border border-feedback-error/20 inline-flex flex-col">
             <h3 className="font-bold text-feedback-error mb-2">Autoexclusão da Conta</h3>
             <p className="text-sm text-text-secondary mb-4 flex-grow">
               Ao ativar isso, o contrato impede a carteira de criar transações. Nossas APIs não aceitarão gerar QR Codes Pix das suas cobranças, invalidando o uso da página de Game.
             </p>
             <button 
                onClick={handleToggleSelfExclusion}
                disabled={isUpdatingSettings || loading}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  settings?.is_self_excluded 
                  ? 'bg-bg-surface border border-feedback-error text-feedback-error shadow-error' 
                  : 'bg-feedback-error text-white hover:bg-red-700'
                }`}
             >
                {settings?.is_self_excluded ? "Desativar Autoexclusão" : "Ativar Bloqueio de Aposta"}
             </button>
          </div>
        </div>
      </div>

    </div>
  );
}

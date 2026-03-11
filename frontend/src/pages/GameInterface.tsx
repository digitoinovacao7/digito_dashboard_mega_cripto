import { useState, useEffect, useRef } from 'react';
import { QrCode, Wand2, ShieldCheck, LockIcon, CheckCircle2, Loader2, KeyRound, ExternalLink, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  startBet, getAdminStats, getConfig, getDrawStatus,
  getPaymentStatus, registerPixKey,
  type Config, type DrawStatus
} from '../api/bridge';

export default function GameInterface() {
  const { user, login } = useAuth();
  const [bets, setBets] = useState<number[][]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isRequestingPix, setIsRequestingPix] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);
  const [targetNumbersCount, setTargetNumbersCount] = useState<number>(15);
  const [currentDrawId, setCurrentDrawId] = useState<string | null>(null);
  const [isDrawIdLoading, setIsDrawIdLoading] = useState(true);
  const [config, setConfig] = useState<Config | null>(null);
  const [isConfigLoading, setIsConfigLoading] = useState(true);
  const [drawStatus, setDrawStatus] = useState<DrawStatus | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [confirmedSolanaTx, setConfirmedSolanaTx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // PIX key
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixKey, setPixKey] = useState(() => localStorage.getItem('mega_pix_key') || '');
  const [pixKeyType, setPixKeyType] = useState<'email'|'cpf'|'phone'|'random'>(() => (localStorage.getItem('mega_pix_key_type') as any) || 'cpf');
  const [isSavingPixKey, setIsSavingPixKey] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIsDrawIdLoading(true);
    getAdminStats()
      .then(data => setCurrentDrawId(data.currentDrawId))
      .catch(console.error)
      .finally(() => setIsDrawIdLoading(false));
    setIsConfigLoading(true);
    getConfig()
      .then(setConfig)
      .catch(console.error)
      .finally(() => setIsConfigLoading(false));
    getDrawStatus()
      .then(setDrawStatus)
      .catch(console.error);
  }, []);

  // Polling: verifica se o pagamento foi aprovado a cada 3s
  useEffect(() => {
    if (!txId || paymentConfirmed) return;
    pollingRef.current = setInterval(async () => {
      try {
        const status = await getPaymentStatus(txId);
        if (status.confirmed) {
          setPaymentConfirmed(true);
          setConfirmedSolanaTx(status.solana_tx || null);
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      } catch { /* ignora erros de rede temporários */ }
    }, 3000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [txId, paymentConfirmed]);

  const getPriceForSelectionLength = (len: number) => {
    if (!config) return 0;
    const betPrice = config.bet_prices.find(p => p.numbers_count === len);
    return betPrice ? betPrice.price : 0;
  };

  const calculateTotalCartPrice = () => {
    let total = 0;
    bets.forEach(b => { total += getPriceForSelectionLength(b.length); });
    if (selectedNumbers.length === targetNumbersCount) {
      total += getPriceForSelectionLength(selectedNumbers.length);
    }
    return total;
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value);
    setTargetNumbersCount(val);
    if (selectedNumbers.length > val) {
      setSelectedNumbers(selectedNumbers.slice(0, val));
    }
  };

  const handleAddBet = () => {
    if (selectedNumbers.length === targetNumbersCount) {
      setBets([...bets, [...selectedNumbers].sort((a,b) => a-b)]);
      setSelectedNumbers([]);
    }
  };

  const handleRemoveBet = (index: number) => {
    setBets(bets.filter((_, i) => i !== index));
  };

  const handleSavePixKey = async () => {
    if (!user || !pixKey.trim()) return;
    setIsSavingPixKey(true);
    try {
      await registerPixKey({ email: user.email, pixKey: pixKey.trim(), pixKeyType });
      localStorage.setItem('mega_pix_key', pixKey.trim());
      localStorage.setItem('mega_pix_key_type', pixKeyType);
      setShowPixModal(false);
      await proceedToCheckout();
    } catch {
      alert('Erro ao salvar chave PIX. Tente novamente.');
    } finally {
      setIsSavingPixKey(false);
    }
  };

  const handleCheckout = async () => {
    if (!pixKey) {
      setShowPixModal(true);
      return;
    }
    await proceedToCheckout();
  };

  const proceedToCheckout = async () => {
    let finalBets = [...bets];
    if (selectedNumbers.length === targetNumbersCount) {
       finalBets.push([...selectedNumbers].sort((a,b) => a-b));
    }
    if (!user || finalBets.length === 0) return;
    setError(null);
    setIsRequestingPix(true);
    try {
      const response = await startBet({
        bets: finalBets,
        userPubKey: user.pubkey,
        payerEmail: user.email,
      });
      if (response.qr_code) {
        setQrCode(response.qr_code);
        setTxId(response.tx_id);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Houve um erro ao processar o PIX. Tente novamente.';
      setError(msg);
    } finally {
      setIsRequestingPix(false);
    }
  };

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < targetNumbersCount) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const handleSurpresinha = () => {
    const nums: number[] = [];
    while(nums.length < targetNumbersCount){
        const r = Math.floor(Math.random() * 25) + 1;
        if(nums.indexOf(r) === -1) nums.push(r);
    }
    setSelectedNumbers(nums.sort((a,b) => a-b));
  };

  const isValidBet = selectedNumbers.length === targetNumbersCount;
  const isAtLimit = selectedNumbers.length === targetNumbersCount;
  const isBetsClosed = drawStatus ? !drawStatus.betsOpen : false;


  return (
    <div className="max-w-5xl mx-auto py-10 relative">

      {/* ── MODAL: Cadastro de Chave PIX ──────────────────────────────── */}
      {showPixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-bg-surface border border-border-subtle rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <KeyRound className="w-6 h-6 text-cta-primary" />
                <h3 className="text-xl font-bold font-heading">Cadastre sua Chave PIX</h3>
              </div>
              <button onClick={() => setShowPixModal(false)} className="text-text-disabled hover:text-text-primary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-text-secondary text-sm mb-6">
              Para receber seus prêmios automaticamente, precisamos da sua chave PIX. Ela ficará registrada de forma segura.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-2 font-bold">Tipo de Chave</label>
                <select
                  value={pixKeyType}
                  onChange={e => setPixKeyType(e.target.value as any)}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary rounded-xl p-3 focus:outline-none focus:border-primary-accent transition-colors"
                >
                  <option value="cpf">CPF</option>
                  <option value="email">E-mail</option>
                  <option value="phone">Telefone</option>
                  <option value="random">Chave Aleatória</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-2 font-bold">Chave PIX</label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={e => setPixKey(e.target.value)}
                  placeholder={pixKeyType === 'cpf' ? '000.000.000-00' : pixKeyType === 'email' ? 'seu@email.com' : pixKeyType === 'phone' ? '+5511999999999' : 'Chave aleatória gerada pelo banco'}
                  className="w-full bg-bg-base border border-border-subtle text-text-primary rounded-xl p-3 focus:outline-none focus:border-primary-accent transition-colors font-mono"
                />
              </div>
              <button
                onClick={handleSavePixKey}
                disabled={!pixKey.trim() || isSavingPixKey}
                className="w-full py-3 rounded-xl font-bold bg-cta-primary hover:bg-feedback-success text-text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSavingPixKey ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : 'Salvar e Continuar →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TELA DE CONFIRMAÇÃO DE PIX ────────────────────────────────── */}
      {paymentConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-bg-surface border border-cta-primary/50 rounded-3xl p-10 max-w-md w-full shadow-2xl animate-fade-in text-center">
            <div className="w-20 h-20 bg-cta-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-cta-primary">
              <CheckCircle2 className="w-10 h-10 text-cta-primary" />
            </div>
            <h3 className="text-3xl font-heading font-black text-cta-primary mb-3">Aposta Confirmada! 🎉</h3>
            <p className="text-text-secondary mb-6">
              Seu PIX foi aprovado e sua aposta foi registrada na blockchain Solana. Boa sorte no sorteio!
            </p>
            {confirmedSolanaTx && (
              <a
                href={confirmedSolanaTx}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary-accent/20 hover:bg-primary-accent/30 text-primary-accent border border-primary-accent/40 px-5 py-2 rounded-xl text-sm font-bold transition-all mb-6"
              >
                Ver Transação na Solana <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={() => { setPaymentConfirmed(false); setQrCode(null); setTxId(null); setBets([]); setSelectedNumbers([]); }}
              className="block w-full py-3 rounded-xl font-bold border border-border-subtle text-text-secondary hover:border-primary-accent hover:text-primary-accent transition-all"
            >
              Fazer uma nova aposta
            </button>
          </div>
        </div>
      )}

      {/* ── BANNER: Apostas Encerradas ────────────────────────────────── */}
      {isBetsClosed && (
        <div className="mb-6 flex items-center justify-center gap-3 bg-feedback-error/10 border border-feedback-error/30 text-feedback-error px-6 py-4 rounded-2xl">
          <LockIcon className="w-5 h-5" />
          <span className="font-bold">As apostas para este concurso estão encerradas.</span>
          <span className="text-sm text-text-secondary">Aguarde o próximo sorteio.</span>
        </div>
      )}

      {/* ── Camada de bloqueio (não logado) ──────────────────────────── */}
      {!user && (
        <div className="absolute inset-x-0 top-1/3 bottom-0 z-10 bg-bg-base/60 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-primary-accent/50 p-8 shadow-2xl">
          <div className="bg-cta-primary/20 p-4 rounded-full mb-6">
             <LockIcon className="w-10 h-10 text-cta-primary" />
          </div>
          <h3 className="text-3xl font-heading font-bold text-text-primary mb-4">Pronto para testar sua sorte?</h3>
          <p className="text-text-secondary text-lg mb-8 text-center max-w-xl">
            Sua identidade on-chain garante que o bilhete será <span className="text-text-primary font-bold">100% seu</span>. Entre agora com sua conta para gerar a carteira vinculada e liberar o volante de apostas.
          </p>
          <button
            onClick={login}
            className="flex items-center gap-3 bg-cta-primary hover:bg-feedback-success text-text-primary font-black py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-success cursor-pointer"
          >
            ENTRAR COM GOOGLE
          </button>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold mb-4">Escolha sua Sorte</h1>
        <p className="text-text-secondary">Selecione 15 números ou peça uma surpresinha.</p>
        {isDrawIdLoading ? (
          <div className="mt-6 inline-block bg-bg-surface/50 px-6 py-2 rounded-full border border-border-subtle text-text-disabled">
            Carregando concurso...
          </div>
        ) : currentDrawId ? (
          <div className="mt-6 inline-block bg-bg-surface/50 px-6 py-2 rounded-full border border-primary-accent/30 text-primary-accent font-bold shadow-lg shadow-primary-accent/10">
            Concurso Atual: #{currentDrawId}
          </div>
        ) : (
          <div className="mt-6 inline-block bg-bg-surface/50 px-6 py-2 rounded-full border border-feedback-error/30 text-feedback-error font-bold">
            Não foi possível carregar o concurso. Tente novamente.
          </div>
        )}
      </div>

      <div className={`grid lg:grid-cols-3 gap-12 transition-opacity duration-300 ${!user ? "opacity-20 pointer-events-none" : ""}`}>
        
        {/* Lado Esquerdo - O Volante */}
        <div className="lg:col-span-2 bg-bg-surface/80 backdrop-blur border border-border-subtle rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
              <span className="text-primary-accent">✦</span> Volante Digital
            </h2>
            <button 
              onClick={handleSurpresinha}
              disabled={!user}
              className="flex items-center gap-2 text-sm text-primary-accent hover:bg-primary-accent/10 px-4 py-2 rounded-full transition-colors border border-primary-accent/20 disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" /> Surpresinha
            </button>
          </div>

          <div className="grid grid-cols-5 gap-3 sm:gap-4 justify-items-center">
            {Array.from({length: 25}, (_, i) => i + 1).map(num => {
              const isSelected = selectedNumbers.includes(num);
              return (
                <button
                  key={num}
                  onClick={() => toggleNumber(num)}
                  disabled={(!isSelected && isAtLimit) || !user || isBetsClosed}
                  className={`
                    w-12 h-12 md:w-16 md:h-16 rounded-full font-bold text-lg md:text-xl transition-all
                    flex items-center justify-center border-2 shadow-lg
                    ${isSelected 
                      ? 'bg-primary-accent border-primary-accent/50 text-text-primary shadow-primary-accent/40 scale-105' 
                      : 'bg-bg-surface border-border-subtle text-text-secondary hover:border-border-subtle hover:bg-bg-surface'
                    }
                    ${((!isSelected && isAtLimit) || !user || isBetsClosed) ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                >
                  {num.toString().padStart(2, '0')}
                </button>
              )
            })}
          </div>
        </div>

        {/* Lado Direito - Checkout */}
        <div className="bg-bg-surface/80 backdrop-blur border border-border-subtle rounded-3xl p-8 shadow-2xl h-fit sticky top-24">
          <h3 className="text-xl font-bold font-heading mb-6 border-b border-border-subtle pb-4">Resumo da Aposta</h3>
          
          <div className="mb-6">
            <label className="block text-sm text-text-secondary mb-2 font-bold">Comprar Múltiplos Números</label>
            <select
               value={targetNumbersCount}
               onChange={handleTargetChange}
               className="w-full bg-bg-base border border-border-subtle text-text-primary rounded-xl p-3 focus:outline-none focus:border-primary-accent transition-colors font-mono font-bold hover:border-primary-accent cursor-pointer"
               disabled={!user || !config || isConfigLoading || isBetsClosed}
            >
               {isConfigLoading ? (
                <option>Carregando...</option>
               ) : config && config.bet_prices.length > 0 ? (
                config.bet_prices.map(opt => (
                  <option key={opt.numbers_count} value={opt.numbers_count} className="bg-[#1A103C] text-white">
                    {opt.numbers_count} números - R$ {opt.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </option>
                ))
               ) : (
                <option>Não há preços de aposta configurados</option>
               )}
            </select>
            <p className="text-xs text-text-disabled mt-2">
              Aumente exponencialmente suas chances jogando mais de 15 números em um só volante.
            </p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-text-secondary">Números escolhidos {bets.length > 0 && `(Jogo Atual)`}</span>
            <span className="font-bold font-mono">
              <span className={isValidBet ? 'text-cta-primary' : 'text-text-primary'}>{selectedNumbers.length}</span> / {targetNumbersCount}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4 min-h-[4rem] content-start">
            {selectedNumbers.sort((a,b) => a-b).map(n => (
              <span key={n} className="bg-bg-surface border border-border-subtle px-2 py-1 flex items-center justify-center rounded-lg text-sm font-mono font-bold w-9 text-text-primary">
                {n.toString().padStart(2, '0')}
              </span>
            ))}
            {selectedNumbers.length === 0 && (
               <div className="text-text-disabled text-sm flex items-center justify-center w-full h-full italic">Nenhum número selecionado</div>
            )}
          </div>
          
          {isValidBet && (
             <div className="text-center mb-4 animate-fade-in">
               <span className="bg-feedback-success/20 text-feedback-success font-bold px-4 py-1.5 rounded-full border border-feedback-success/30 text-xs tracking-wider uppercase inline-block animate-pulse shadow-error">
                  🕹️ VOLANTE PREENCHIDO! (GAME OVER)
               </span>
               <p className="text-[10px] text-text-secondary mt-2">Você ficou sem jogadas neste volante. Clique em Adicionar Jogo!</p>
             </div>
          )}

          <button
              onClick={handleAddBet}
              disabled={!isValidBet || !user || isBetsClosed}
              className={`w-full py-3 mb-6 rounded-xl font-bold text-sm transition-all border ${isValidBet && user && !isBetsClosed ? 'border-primary-accent text-primary-accent hover:bg-primary-accent/10 shadow-primary-accent' : 'border-border-subtle text-text-disabled cursor-not-allowed'}`}
          >
              + Adicionar Jogo
          </button>

          {/* Carrinho de Jogos */}
          {bets.length > 0 && (
            <div className="mb-6 max-h-40 overflow-y-auto space-y-2 pr-2">
               {bets.map((bet, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-bg-surface/50 p-3 rounded-lg border border-border-subtle">
                      <div className="text-xs text-cta-primary font-mono leading-tight pr-2 break-all">
                        {bet.map(n => n.toString().padStart(2, '00')).join(', ')}
                      </div>
                      <button onClick={() => handleRemoveBet(idx)} className="text-feedback-error hover:text-feedback-error text-xs shrink-0 font-bold uppercase tracking-wider">
                        Remover
                      </button>
                  </div>
               ))}
            </div>
          )}

          <div className="border-t border-border-subtle pt-6 mb-8 mt-2">
            <div className="flex justify-between items-end">
              <span className="text-text-secondary">Total a pagar</span>
              <span className="text-3xl font-heading font-bold text-text-primary">
                R$ {calculateTotalCartPrice().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-text-disabled text-xs mt-1 text-right">
              {bets.length + (isValidBet ? 1 : 0)} jogo(s) na aposta
            </p>
          </div>

          {/* Mensagem de erro */}
          {error && (
            <div className="mb-4 p-3 bg-feedback-error/10 border border-feedback-error/30 rounded-xl text-feedback-error text-sm font-medium flex items-start gap-2">
              <X className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Seção do Botão ou Exibição do PIX */}
          <div className="mt-2 transition-all relative">
            {qrCode ? (
               <div className="bg-bg-surface/80 p-6 rounded-2xl border border-cta-primary animate-fade-in text-center">
                  <h4 className="font-heading font-bold text-cta-primary mb-2">Escaneie para Pagar</h4>
                  <div className="bg-white p-4 rounded-xl mx-auto w-fit mb-4 mix-blend-screen shadow-lg shadow-cta-primary/20">
                     <QrCode className="w-40 h-40 text-primary mx-auto" />
                  </div>
                  <p className="text-xs text-text-secondary mb-2 font-mono break-all">{qrCode}</p>
                  <button onClick={() => navigator.clipboard.writeText(qrCode)} className="text-sm bg-bg-surface hover:bg-border-subtle text-text-primary px-4 py-2 rounded-lg transition-colors border border-border-subtle">
                    Copiar Código PIX
                  </button>
                  <div className="mt-4 pt-4 border-t border-border-subtle text-xs text-primary-accent font-mono flex items-center justify-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Aguardando confirmação do pagamento...
                  </div>
               </div>
            ) : (
              <button 
                  onClick={handleCheckout}
                  disabled={(!isValidBet && bets.length === 0) || !user || isRequestingPix || isBetsClosed}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                    ${isBetsClosed
                      ? 'bg-bg-surface text-text-disabled cursor-not-allowed opacity-60'
                      : isRequestingPix 
                      ? 'bg-bg-surface text-text-secondary opacity-80 cursor-wait'
                      : (isValidBet || bets.length > 0) && user
                      ? 'bg-cta-primary hover:bg-feedback-success text-text-primary shadow-success cursor-pointer' 
                      : 'bg-bg-surface text-text-disabled cursor-not-allowed'
                    }
                  `}
                >
                  {isBetsClosed
                    ? <><LockIcon className="w-5 h-5" /> Apostas Encerradas</>
                    : isRequestingPix
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Gerando Cobrança...</>
                    : (isValidBet || bets.length > 0)
                    ? <><QrCode /> {!pixKey ? 'Continuar (Cadastrar PIX Key)' : 'Gerar PIX e Registrar'}</>
                    : `Selecione ${targetNumbersCount} números`
                  }
              </button>
            )}
            
            {!qrCode && !isBetsClosed && (
              <p className="flex justify-center items-center gap-2 mt-4 text-xs text-text-disabled">
                <ShieldCheck className="w-4 h-4" /> 100% Garantido em Smart Contract
              </p>
            )}
            {!pixKey && !qrCode && user && !isBetsClosed && (
              <p className="flex justify-center items-center gap-2 mt-2 text-xs text-primary-accent/70">
                <KeyRound className="w-3 h-3" /> Chave PIX não cadastrada – será solicitada no checkout
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

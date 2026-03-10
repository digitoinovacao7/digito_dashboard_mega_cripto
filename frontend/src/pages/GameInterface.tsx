import { useState } from 'react';
import { QrCode, Wand2, ShieldCheck, LockIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { startBet } from '../api/bridge';

export default function GameInterface() {
  const { user, login } = useAuth();
  const [bets, setBets] = useState<number[][]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isRequestingPix, setIsRequestingPix] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [targetNumbersCount, setTargetNumbersCount] = useState<number>(15);
  
  const OPTIONS = [
    { val: 15, label: "15 números", price: 3.50 },
    { val: 16, label: "16 números", price: 56.00 },
    { val: 17, label: "17 números", price: 476.00 },
    { val: 18, label: "18 números", price: 2856.00 },
    { val: 19, label: "19 números", price: 13566.00 },
    { val: 20, label: "20 números", price: 54264.00 },
  ];

  const getPriceForSelectionLength = (len: number) => {
    switch (len) {
      case 15: return 3.50;
      case 16: return 56.00;
      case 17: return 476.00;
      case 18: return 2856.00;
      case 19: return 13566.00;
      case 20: return 54264.00;
      default: return 0;
    }
  };

  const calculateTotalCartPrice = () => {
    let total = 0;
    // Soma as apostas no carrinho
    bets.forEach(b => {
      total += getPriceForSelectionLength(b.length);
    });
    // Soma a aposta atual se ela for válida (>= MIN_NUMBERS)
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

  const handleCheckout = async () => {
    let finalBets = [...bets];
    if (selectedNumbers.length === targetNumbersCount) {
       finalBets.push([...selectedNumbers].sort((a,b) => a-b));
    }
    
    if (!user || finalBets.length === 0) return;
    
    setIsRequestingPix(true);
    try {
      const response = await startBet(finalBets, user.pubkey);
      if (response.qr_code) {
        setQrCode(response.qr_code);
      }
    } catch (error) {
      alert("Houve um erro ao processar o PIX. Tente novamente.");
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

  return (
    <div className="max-w-5xl mx-auto py-10 relative">
      
      {/* Camada de bloqueio de Segurança */}
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
                  disabled={(!isSelected && isAtLimit) || !user}
                  className={`
                    w-12 h-12 md:w-16 md:h-16 rounded-full font-bold text-lg md:text-xl transition-all
                    flex items-center justify-center border-2 shadow-lg
                    ${isSelected 
                      ? 'bg-primary-accent border-primary-accent/50 text-text-primary shadow-primary-accent/40 scale-105' 
                      : 'bg-bg-surface border-border-subtle text-text-secondary hover:border-border-subtle hover:bg-bg-surface'
                    }
                    ${(!isSelected && isAtLimit) || !user ? 'opacity-40 cursor-not-allowed' : ''}
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
               disabled={!user}
            >
               {OPTIONS.map(opt => (
                  <option key={opt.val} value={opt.val} className="bg-[#1A103C] text-white">
                    {opt.label} - R$ {opt.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </option>
               ))}
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
              disabled={!isValidBet || !user}
              className={`w-full py-3 mb-6 rounded-xl font-bold text-sm transition-all border ${isValidBet && user ? 'border-primary-accent text-primary-accent hover:bg-primary-accent/10 shadow-primary-accent' : 'border-border-subtle text-text-disabled cursor-not-allowed'}`}
          >
              + Adicionar Jogo
          </button>

          {/* Carrinho de Jogos */}
          {bets.length > 0 && (
            <div className="mb-6 max-h-40 overflow-y-auto space-y-2 pr-2">
               {bets.map((bet, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-bg-surface/50 p-3 rounded-lg border border-border-subtle">
                      <div className="text-xs text-cta-primary font-mono leading-tight pr-2 break-all">
                        {bet.map(n => n.toString().padStart(2, '0')).join(', ')}
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

          {/* Seção do Botão ou Exibição do PIX */}
          <div className="mt-8 transition-all relative">
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
                  <div className="mt-4 pt-4 border-t border-border-subtle text-xs text-primary-accent animate-pulse font-mono flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-accent"></span> Aguardando Confirmação
                  </div>
               </div>
            ) : (
              <button 
                  onClick={handleCheckout}
                  disabled={(!isValidBet && bets.length === 0) || !user || isRequestingPix}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                    ${isRequestingPix 
                      ? 'bg-bg-surface text-text-secondary opacity-80 cursor-wait'
                      : (isValidBet || bets.length > 0) && user
                      ? 'bg-cta-primary hover:bg-feedback-success text-text-primary shadow-success cursor-pointer' 
                      : 'bg-bg-surface text-text-disabled cursor-not-allowed'
                    }
                  `}
                >
                  {isRequestingPix ? 'Gerando Cobrança...' : (isValidBet || bets.length > 0) ? <><QrCode /> Gerar PIX e Registrar</> : `Selecione ${targetNumbersCount} números`}
              </button>
            )}
            
            {!qrCode && (
              <p className="flex justify-center items-center gap-2 mt-4 text-xs text-text-disabled">
                <ShieldCheck className="w-4 h-4" /> 100% Garantido em Smart Contract
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

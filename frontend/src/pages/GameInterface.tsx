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
  
  const MAX_NUMBERS = 15;

  const handleAddBet = () => {
    if (selectedNumbers.length === MAX_NUMBERS) {
      setBets([...bets, [...selectedNumbers].sort((a,b) => a-b)]);
      setSelectedNumbers([]);
    }
  };

  const handleRemoveBet = (index: number) => {
    setBets(bets.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    let finalBets = [...bets];
    if (selectedNumbers.length === MAX_NUMBERS) {
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
    } else if (selectedNumbers.length < MAX_NUMBERS) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const handleSurpresinha = () => {
    const nums: number[] = [];
    while(nums.length < MAX_NUMBERS){
        const r = Math.floor(Math.random() * 25) + 1;
        if(nums.indexOf(r) === -1) nums.push(r);
    }
    setSelectedNumbers(nums.sort((a,b) => a-b));
  };

  const isFull = selectedNumbers.length === MAX_NUMBERS;

  return (
    <div className="max-w-5xl mx-auto py-10 relative">
      
      {/* Camada de bloqueio de Segurança */}
      {!user && (
        <div className="absolute inset-x-0 top-1/3 bottom-0 z-10 bg-brand-bg/60 backdrop-blur-md flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-brand-accent/50 p-8 shadow-2xl">
          <div className="bg-brand-pix/20 p-4 rounded-full mb-6">
             <LockIcon className="w-10 h-10 text-brand-pix" />
          </div>
          <h3 className="text-3xl font-heading font-bold text-white mb-4">Pronto para testar sua sorte?</h3>
          <p className="text-slate-300 text-lg mb-8 text-center max-w-xl">
            Sua identidade on-chain garante que o bilhete será <span className="text-white font-bold">100% seu</span>. Entre agora com sua conta para gerar a carteira vinculada e liberar o volante de apostas.
          </p>
          <button 
            onClick={login}
            className="flex items-center gap-3 bg-brand-pix hover:bg-green-500 text-white font-black py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(34,197,94,0.4)]"
          >
            ENTRAR COM GOOGLE
          </button>
        </div>
      )}


      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold mb-4">Escolha sua Sorte</h1>
        <p className="text-slate-400">Selecione 15 números ou peça uma surpresinha.</p>
      </div>

      <div className={`grid lg:grid-cols-3 gap-12 transition-opacity duration-300 ${!user ? "opacity-20 pointer-events-none" : ""}`}>
        
        {/* Lado Esquerdo - O Volante */}
        <div className="lg:col-span-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
              <span className="text-brand-web3">✦</span> Volante Digital
            </h2>
            <button 
              onClick={handleSurpresinha}
              disabled={!user}
              className="flex items-center gap-2 text-sm text-brand-accent hover:bg-brand-accent/10 px-4 py-2 rounded-full transition-colors border border-brand-accent/20 disabled:opacity-50"
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
                  disabled={(!isSelected && isFull) || !user}
                  className={`
                    w-12 h-12 md:w-16 md:h-16 rounded-full font-bold text-lg md:text-xl transition-all
                    flex items-center justify-center border-2 shadow-lg
                    ${isSelected 
                      ? 'bg-brand-web3 border-brand-web3/50 text-white shadow-brand-web3/40 scale-105' 
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                    }
                    ${(!isSelected && isFull) || !user ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                >
                  {num.toString().padStart(2, '0')}
                </button>
              )
            })}
          </div>
        </div>

        {/* Lado Direito - Checkout */}
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-3xl p-8 shadow-2xl h-fit sticky top-24">
          <h3 className="text-xl font-bold font-heading mb-6 border-b border-slate-700 pb-4">Resumo da Aposta</h3>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400">Números escolhidos {bets.length > 0 && `(Jogo Atual)`}</span>
            <span className="font-bold font-mono">
              <span className={isFull ? 'text-brand-pix' : 'text-slate-200'}>{selectedNumbers.length}</span> / 15
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4 min-h-[4rem] content-start">
            {selectedNumbers.sort((a,b) => a-b).map(n => (
              <span key={n} className="bg-slate-900 border border-slate-700 px-2 py-1 flex items-center justify-center rounded-lg text-sm font-mono font-bold w-9 text-slate-300">
                {n.toString().padStart(2, '0')}
              </span>
            ))}
            {selectedNumbers.length === 0 && (
               <div className="text-slate-600 text-sm flex items-center justify-center w-full h-full italic">Nenhum número selecionado</div>
            )}
          </div>

          <button
              onClick={handleAddBet}
              disabled={!isFull || !user}
              className={`w-full py-3 mb-6 rounded-xl font-bold text-sm transition-all border ${isFull && user ? 'border-brand-web3 text-brand-web3 hover:bg-brand-web3/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'border-slate-700 text-slate-600 cursor-not-allowed'}`}
          >
              + Adicionar Jogo
          </button>

          {/* Carrinho de Jogos */}
          {bets.length > 0 && (
            <div className="mb-6 max-h-40 overflow-y-auto space-y-2 pr-2">
               {bets.map((bet, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                      <div className="text-xs text-brand-pix font-mono leading-tight pr-2 break-all">
                        {bet.map(n => n.toString().padStart(2, '0')).join(', ')}
                      </div>
                      <button onClick={() => handleRemoveBet(idx)} className="text-red-500 hover:text-red-400 text-xs shrink-0 font-bold uppercase tracking-wider">
                        Remover
                      </button>
                  </div>
               ))}
            </div>
          )}

          <div className="border-t border-slate-700 pt-6 mb-8 mt-2">
            <div className="flex justify-between items-end">
              <span className="text-slate-400">Total a pagar</span>
              <span className="text-3xl font-heading font-bold text-white">
                R$ {((bets.length + (isFull ? 1 : 0)) * 5).toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-1 text-right">
              {bets.length + (isFull ? 1 : 0)} jogo(s) na aposta
            </p>
          </div>

          {/* Seção do Botão ou Exibição do PIX */}
          <div className="mt-8 transition-all relative">
            {qrCode ? (
               <div className="bg-slate-900/80 p-6 rounded-2xl border border-brand-pix animate-fade-in text-center">
                  <h4 className="font-heading font-bold text-brand-pix mb-2">Escaneie para Pagar</h4>
                  <div className="bg-white p-4 rounded-xl mx-auto w-fit mb-4 mix-blend-screen shadow-lg shadow-brand-pix/20">
                     <QrCode className="w-40 h-40 text-black mx-auto" />
                  </div>
                  <p className="text-xs text-slate-400 mb-2 font-mono break-all">{qrCode}</p>
                  <button onClick={() => navigator.clipboard.writeText(qrCode)} className="text-sm bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors border border-slate-600">
                    Copiar Código PIX
                  </button>
                  <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-brand-accent animate-pulse font-mono flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-accent"></span> Aguardando Confirmação
                  </div>
               </div>
            ) : (
              <button 
                  onClick={handleCheckout}
                  disabled={(!isFull && bets.length === 0) || !user || isRequestingPix}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                    ${isRequestingPix 
                      ? 'bg-slate-700 text-slate-400 opacity-80 cursor-wait'
                      : (isFull || bets.length > 0) && user
                      ? 'bg-brand-pix hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }
                  `}
                >
                  {isRequestingPix ? 'Gerando Cobrança...' : (isFull || bets.length > 0) ? <><QrCode /> Gerar PIX e Registrar</> : 'Selecione 15 números'}
              </button>
            )}
            
            {!qrCode && (
              <p className="flex justify-center items-center gap-2 mt-4 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4" /> 100% Garantido em Smart Contract
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState } from 'react';
import { QrCode, Wand2, ShieldCheck } from 'lucide-react';

export default function GameInterface() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const MAX_NUMBERS = 15;

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
    <div className="max-w-5xl mx-auto py-10">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold mb-4">Escolha sua Sorte</h1>
        <p className="text-slate-400">Selecione 15 números ou peça uma surpresinha.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        
        {/* Lado Esquerdo - O Volante */}
        <div className="lg:col-span-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
              <span className="text-brand-web3">✦</span> Volante Digital
            </h2>
            <button 
              onClick={handleSurpresinha}
              className="flex items-center gap-2 text-sm text-brand-accent hover:bg-brand-accent/10 px-4 py-2 rounded-full transition-colors border border-brand-accent/20"
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
                  disabled={!isSelected && isFull}
                  className={`
                    w-12 h-12 md:w-16 md:h-16 rounded-full font-bold text-lg md:text-xl transition-all
                    flex items-center justify-center border-2 shadow-lg
                    ${isSelected 
                      ? 'bg-brand-web3 border-brand-web3/50 text-white shadow-brand-web3/40' 
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800'
                    }
                    ${!isSelected && isFull ? 'opacity-40 cursor-not-allowed' : ''}
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
            <span className="text-slate-400">Números escolhidos</span>
            <span className="font-bold font-mono">
              <span className={isFull ? 'text-brand-pix' : 'text-slate-200'}>{selectedNumbers.length}</span> / 15
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8 min-h-24 content-start">
            {selectedNumbers.sort((a,b) => a-b).map(n => (
              <span key={n} className="bg-slate-900 text-brand-web3 border border-brand-web3/30 px-2 py-1 flex items-center justify-center rounded-lg text-sm font-mono font-bold w-9">
                {n.toString().padStart(2, '0')}
              </span>
            ))}
          </div>

          <div className="border-t border-slate-700 pt-6 mb-8">
            <div className="flex justify-between items-end">
              <span className="text-slate-400">Total a pagar</span>
              <span className="text-3xl font-heading font-bold text-white">R$ 5,00</span>
            </div>
          </div>

          <button 
            disabled={!isFull}
            className={`
              w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
              ${isFull 
                ? 'bg-brand-pix hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }
            `}
          >
            {isFull ? <><QrCode /> Gerar PIX e Registrar</> : 'Selecione 15 números'}
          </button>
          
          <p className="flex justify-center items-center gap-2 mt-4 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4" /> 100% Garantido em Smart Contract
          </p>
        </div>

      </div>
    </div>
  );
}

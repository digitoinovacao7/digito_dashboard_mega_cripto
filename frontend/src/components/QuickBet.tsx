import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function QuickBet() {
  const [betPlaced, setBetPlaced] = useState(false);

  const handlePlaceBet = () => {
    // Here you would typically handle the logic for placing a bet.
    // For this example, we'll just simulate it.
    setBetPlaced(true);
    setTimeout(() => setBetPlaced(false), 3000); // Reset after 3 seconds
  };

  return (
    <div className="bg-bg-surface/50 border border-border-subtle p-6 rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Aposta Rápida</h2>
      {betPlaced ? (
        <div className="text-center text-feedback-success">
          <p>Aposta realizada com sucesso!</p>
        </div>
      ) : (
        <>
          <p className="text-text-secondary mb-4">Selecione 15 números para fazer uma aposta rápida.</p>
          {/* A grid for number selection could go here */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
              <button 
                key={num} 
                className="p-2 rounded-md bg-bg-surface hover:bg-border-subtle text-text-primary"
              >
                {num}
              </button>
            ))}
          </div>
          <button 
            onClick={handlePlaceBet}
            className="w-full flex items-center justify-center gap-2 bg-cta-primary hover:bg-feedback-success text-text-primary px-6 py-3 rounded-lg text-lg font-bold transition-all"
          >
            Apostar <ArrowRight size={20} />
          </button>
        </>
      )}
    </div>
  );
}

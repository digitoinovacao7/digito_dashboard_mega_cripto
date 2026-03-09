import { useState, useEffect } from 'react';
import Marquee from "react-fast-marquee";
import { getPrices } from '../api/bridge';
import type { CryptoPrice } from '../api/bridge';

export default function CryptoTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getPrices();
        setPrices(data);
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      }
    };

    fetchPrices(); // Call on mount
    const intervalId = setInterval(fetchPrices, 60000); // Update every 60 seconds

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  return (
    <div className="bg-bg-surface border-t border-b border-border-subtle py-2">
      <Marquee gradient={false} speed={50}>
        {prices.map((crypto) => (
          <div key={crypto.id} className="flex items-center mx-4">
            <img src={crypto.image} alt={crypto.name} width={20} height={20} className="mr-2" />
            <span className="font-bold text-text-primary">{crypto.symbol}</span>
            <span className="text-text-secondary mx-2">R$ {crypto.price_brl.toFixed(2)}</span>
            <span className={crypto.change_24h >= 0 ? 'text-feedback-success' : 'text-feedback-error'}>
              {crypto.change_24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

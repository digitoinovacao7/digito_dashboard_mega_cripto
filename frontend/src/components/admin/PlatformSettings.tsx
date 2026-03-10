import { Settings, PlusCircle, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getConfig, updateConfig, type Config } from '../../api/bridge';

export default function PlatformSettings() {
  const [config, setConfig] = useState<Config>({ bet_prices: [], prize_percentage: 0 });
  const [newPrice, setNewPrice] = useState({ numbers_count: 0, price: 0 });

  useEffect(() => {
    getConfig().then(setConfig);
  }, []);

  const handleSave = () => {
    updateConfig(config).then(() => {
      alert('Configurações salvas com sucesso!');
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    const newBetPrices = [...config.bet_prices];
    newBetPrices[index] = { ...newBetPrices[index], price: parseFloat(value) };
    setConfig((prevConfig) => ({
      ...prevConfig,
      bet_prices: newBetPrices,
    }));
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      prize_percentage: parseFloat(value),
    }));
  };

  const handleAddPrice = () => {
    if (newPrice.numbers_count > 0 && newPrice.price > 0) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        bet_prices: [...prevConfig.bet_prices, newPrice],
      }));
      setNewPrice({ numbers_count: 0, price: 0 });
    }
  };

  const handleRemovePrice = (index: number) => {
    const newBetPrices = [...config.bet_prices];
    newBetPrices.splice(index, 1);
    setConfig((prevConfig) => ({
      ...prevConfig,
      bet_prices: newBetPrices,
    }));
  };

  return (
    <div className="bg-bg-surface border border-border-subtle p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Settings /> Configurações da Plataforma</h2>
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Preços das Apostas</h3>
        {config.bet_prices.map((betPrice, index) => (
          <div className="flex items-center justify-between" key={betPrice.numbers_count}>
            <label htmlFor={`bet-price-${betPrice.numbers_count}`}>Preço para {betPrice.numbers_count} números (R$)</label>
            <div className="flex items-center gap-2">
              <input
                id={`bet-price-${betPrice.numbers_count}`}
                type="number"
                value={betPrice.price}
                onChange={(e) => handlePriceChange(e, index)}
                step="0.50"
                className="bg-bg-surface border border-border-subtle p-2 rounded-lg w-32"
              />
              <button onClick={() => handleRemovePrice(index)} className="text-feedback-error hover:text-feedback-error/80">
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between">
          <label htmlFor="new-numbers-count">Novos números</label>
          <input
            id="new-numbers-count"
            type="number"
            value={newPrice.numbers_count}
            onChange={(e) => setNewPrice({ ...newPrice, numbers_count: parseInt(e.target.value) })}
            className="bg-bg-surface border border-border-subtle p-2 rounded-lg w-20"
          />
          <label htmlFor="new-price">Preço (R$)</label>
          <input
            id="new-price"
            type="number"
            value={newPrice.price}
            onChange={(e) => setNewPrice({ ...newPrice, price: parseFloat(e.target.value) })}
            step="0.50"
            className="bg-bg-surface border border-border-subtle p-2 rounded-lg w-24"
          />
          <button onClick={handleAddPrice} className="text-cta-primary hover:text-cta-primary/80">
            <PlusCircle />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="prize_percentage">Percentual do Prêmio (%)</label>
          <input
            id="prize_percentage"
            type="number"
            value={config.prize_percentage}
            onChange={handlePercentageChange}
            step="1"
            className="bg-bg-surface border border-border-subtle p-2 rounded-lg w-32"
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-cta-primary hover:bg-feedback-success text-text-primary font-bold py-2 px-4 rounded-lg"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}

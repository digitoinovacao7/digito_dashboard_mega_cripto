import { Settings, PlusCircle, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getConfig, updateConfig, type Config } from '../../api/bridge';

export default function PlatformSettings() {
  const [activeTab, setActiveTab] = useState<'prices' | 'tiers'>('prices');
  const [config, setConfig] = useState<Config>({ global_prize_pool_percentage: 60, bet_prices: [], prize_tiers: [] });
  const [initialConfig, setInitialConfig] = useState<Config | null>(null);
  
  const [newPrice, setNewPrice] = useState({ numbers_count: 0, price: 0 });
  const [newTier, setNewTier] = useState({ matches: 0, prize_percentage: 0 });

  useEffect(() => {
    getConfig().then(data => {
      setConfig(data);
      setInitialConfig(data);
    });
  }, []);

  const handleSave = () => {
    updateConfig(config)
      .then(savedConfig => {
        alert('Configurações salvas com sucesso!');
        setConfig(savedConfig);
        setInitialConfig(savedConfig);
      })
      .catch(error => {
        console.error('Failed to save config:', error);
        alert('Erro ao salvar as configurações. Tente novamente.');
      });
  };

  const handleBetPriceChange = (index: number, field: 'price', value: string) => {
    const newBetPrices = [...config.bet_prices];
    newBetPrices[index] = { ...newBetPrices[index], [field]: parseFloat(value) || 0 };
    setConfig(prev => ({ ...prev, bet_prices: newBetPrices }));
  };

  const handleAddPrice = () => {
    if (newPrice.numbers_count > 0 && newPrice.price > 0) {
      setConfig(prev => ({ ...prev, bet_prices: [...prev.bet_prices, newPrice] }));
      setNewPrice({ numbers_count: 0, price: 0 });
    }
  };

  const handleRemovePrice = (index: number) => {
    const newBetPrices = [...config.bet_prices];
    newBetPrices.splice(index, 1);
    setConfig(prev => ({ ...prev, bet_prices: newBetPrices }));
  };

  const handleTierChange = (index: number, field: 'prize_percentage', value: string) => {
    const newTiers = [...config.prize_tiers];
    newTiers[index] = { ...newTiers[index], [field]: parseFloat(value) || 0 };
    setConfig(prev => ({ ...prev, prize_tiers: newTiers }));
  };

  const handleAddTier = () => {
    if (newTier.matches > 0 && newTier.prize_percentage > 0) {
      setConfig(prev => ({ ...prev, prize_tiers: [...prev.prize_tiers, newTier] }));
      setNewTier({ matches: 0, prize_percentage: 0 });
    }
  };

  const handleRemoveTier = (index: number) => {
    const newTiers = [...config.prize_tiers];
    newTiers.splice(index, 1);
    setConfig(prev => ({ ...prev, prize_tiers: newTiers }));
  };

  const isChanged = JSON.stringify(config) !== JSON.stringify(initialConfig);

  return (
    <div className="bg-bg-surface border border-border-subtle p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Settings /> Configurações da Plataforma</h2>
      
      <div className="mb-6">
        <label className="text-sm font-bold text-text-primary block mb-2">Percentual Global de Arrecadação para o Prêmio (%)</label>
        <p className="text-xs text-text-secondary mb-2">Este é o percentual do valor de cada aposta que vai para o prêmio acumulado.</p>
        <input
          type="number"
          value={config.global_prize_pool_percentage || 0}
          onChange={(e) => setConfig(prev => ({ ...prev, global_prize_pool_percentage: parseFloat(e.target.value) || 0 }))}
          step="0.1"
          className="bg-bg-base border border-border-subtle p-3 rounded-xl w-32 text-sm outline-none focus:border-primary-accent"
        />
      </div>

      <div className="flex border-b border-border-subtle mb-6">
        <button 
          onClick={() => setActiveTab('prices')}
          className={`py-3 px-6 font-bold text-sm transition-colors ${activeTab === 'prices' ? 'text-primary-accent border-b-2 border-primary-accent bg-bg-base/30' : 'text-text-secondary hover:text-text-primary hover:bg-bg-base/20'}`}
        >
          Preços das Apostas
        </button>
        <button 
          onClick={() => setActiveTab('tiers')}
          className={`py-3 px-6 font-bold text-sm transition-colors ${activeTab === 'tiers' ? 'text-primary-accent border-b-2 border-primary-accent bg-bg-base/30' : 'text-text-secondary hover:text-text-primary hover:bg-bg-base/20'}`}
        >
          Faixas de Premiação
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'prices' && (
          <>
            <h3 className="text-lg font-bold">Distribuição e Preços das Apostas</h3>
            {config.bet_prices.map((betPrice, index) => (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border-subtle rounded-xl bg-bg-base/50" key={betPrice.numbers_count}>
                <div className="font-bold text-text-primary min-w-[120px]">
                  {betPrice.numbers_count} números
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-text-secondary mb-1">Preço (R$)</label>
                    <input
                      type="number"
                      value={betPrice.price}
                      onChange={(e) => handleBetPriceChange(index, 'price', e.target.value)}
                      step="0.50"
                      className="bg-bg-surface border border-border-subtle p-2 rounded-lg w-32 text-sm outline-none focus:border-primary-accent"
                    />
                  </div>

                  <button onClick={() => handleRemovePrice(index)} className="text-feedback-error hover:text-red-400 p-2 mt-4 transition-colors bg-feedback-error/10 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-6 border-t border-border-subtle">
               <h4 className="font-bold text-sm mb-4 text-text-secondary">Cadastrar nova modalidade</h4>
               <div className="flex flex-wrap items-center gap-4 bg-bg-base/30 p-4 rounded-xl border border-border-subtle border-dashed">
                <div className="flex flex-col">
                  <label htmlFor="new-numbers-count" className="text-xs text-text-secondary mb-1">Qtd. Números</label>
                  <input
                    id="new-numbers-count"
                    type="number"
                    value={newPrice.numbers_count}
                    onChange={(e) => setNewPrice({ ...newPrice, numbers_count: parseInt(e.target.value) || 0 })}
                    className="bg-bg-surface border border-border-subtle p-2 rounded-lg w-24 text-sm outline-none focus:border-primary-accent"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label htmlFor="new-price" className="text-xs text-text-secondary mb-1">Preço (R$)</label>
                  <input
                    id="new-price"
                    type="number"
                    value={newPrice.price}
                    onChange={(e) => setNewPrice({ ...newPrice, price: parseFloat(e.target.value) || 0 })}
                    step="0.50"
                    className="bg-bg-surface border border-border-subtle p-2 rounded-lg w-32 text-sm outline-none focus:border-primary-accent"
                  />
                </div>

                <button onClick={handleAddPrice} className="bg-cta-primary/20 text-cta-primary hover:bg-cta-primary/30 p-2 mt-4 rounded-lg flex items-center justify-center transition-colors">
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'tiers' && (
          <>
            <h3 className="text-lg font-bold">Faixas de Premiação</h3>
            <p className="text-xs text-text-secondary mb-4">
              Configure a porcentagem do prêmio acumulado que será distribuída para os ganhadores de cada faixa de acertos. 
              A soma de todas as faixas deve ser idealmente 100%.
            </p>
            {config.prize_tiers && config.prize_tiers.map((tier, index) => (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border-subtle rounded-xl bg-bg-base/50" key={tier.matches}>
                <div className="font-bold text-text-primary min-w-[120px]">
                  {tier.matches} acertos
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-text-secondary mb-1">Fatia do Prêmio (%)</label>
                    <input
                      type="number"
                      value={tier.prize_percentage}
                      onChange={(e) => handleTierChange(index, 'prize_percentage', e.target.value)}
                      step="0.1"
                      className="bg-bg-surface border border-border-subtle p-2 rounded-lg w-32 text-sm outline-none focus:border-primary-accent"
                    />
                  </div>

                  <button onClick={() => handleRemoveTier(index)} className="text-feedback-error hover:text-red-400 p-2 mt-4 transition-colors bg-feedback-error/10 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-6 border-t border-border-subtle">
               <h4 className="font-bold text-sm mb-4 text-text-secondary">Cadastrar nova faixa de premiação</h4>
               <div className="flex flex-wrap items-center gap-4 bg-bg-base/30 p-4 rounded-xl border border-border-subtle border-dashed">
                <div className="flex flex-col">
                  <label htmlFor="new-tier-matches" className="text-xs text-text-secondary mb-1">Qtd. Acertos</label>
                  <input
                    id="new-tier-matches"
                    type="number"
                    value={newTier.matches}
                    onChange={(e) => setNewTier({ ...newTier, matches: parseInt(e.target.value) || 0 })}
                    className="bg-bg-surface border border-border-subtle p-2 rounded-lg w-24 text-sm outline-none focus:border-primary-accent"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label htmlFor="new-tier-percentage" className="text-xs text-text-secondary mb-1">Fatia do Prêmio (%)</label>
                  <input
                    id="new-tier-percentage"
                    type="number"
                    value={newTier.prize_percentage}
                    onChange={(e) => setNewTier({ ...newTier, prize_percentage: parseFloat(e.target.value) || 0 })}
                    step="0.1"
                    className="bg-bg-surface border border-border-subtle p-2 rounded-lg w-32 text-sm outline-none focus:border-primary-accent"
                  />
                </div>

                <button onClick={handleAddTier} className="bg-cta-primary/20 text-cta-primary hover:bg-cta-primary/30 p-2 mt-4 rounded-lg flex items-center justify-center transition-colors">
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}

        <div className="pt-6">
          <button
            onClick={handleSave}
            disabled={!isChanged}
            className="w-full md:w-auto bg-cta-primary hover:bg-cta-primary/90 text-text-primary shadow-lg shadow-cta-primary/20 font-bold py-3 px-8 rounded-xl disabled:bg-bg-surface disabled:text-text-disabled disabled:cursor-not-allowed transition-all"
          >
            Salvar Alterações Globais
          </button>
        </div>
      </div>
    </div>
  );
}

import { Settings } from 'lucide-react';

export default function PlatformSettings() {
  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Settings /> Configurações da Plataforma</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="bet-price">Preço da Aposta (R$)</label>
          <input id="bet-price" type="number" defaultValue="2.50" step="0.50" className="bg-slate-900 border border-slate-700 p-2 rounded-lg w-32" />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="prize-percentage">Percentual do Prêmio (%)</label>
          <input id="prize-percentage" type="number" defaultValue="60" step="1" className="bg-slate-900 border border-slate-700 p-2 rounded-lg w-32" />
        </div>
        <button className="bg-brand-pix hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg">
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}

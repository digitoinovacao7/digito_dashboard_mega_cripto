import { useState } from 'react';
import { Gift, Plus } from 'lucide-react';

const draws = [
  { id: 101, date: '2026-03-15', status: 'Aberto' },
  { id: 100, date: '2026-03-08', status: 'Fechado', winners: 12 },
];

export default function DrawManagement() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><Gift /> Gerenciamento de Sorteios</h2>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="bg-brand-pix hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <Plus /> Novo Sorteio
        </button>
      </div>

      {showCreate && (
        <div className="bg-slate-900 p-4 rounded-lg mb-4">
          <h3 className="font-bold mb-2">Criar Novo Sorteio</h3>
          <div className="flex gap-4">
            <input type="date" className="bg-slate-800 border border-slate-700 p-2 rounded-lg" />
            <button className="bg-brand-pix hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg">Criar</button>
          </div>
        </div>
      )}

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="p-2">ID</th>
            <th className="p-2">Data</th>
            <th className="p-2">Status</th>
            <th className="p-2">Ganhadores</th>
          </tr>
        </thead>
        <tbody>
          {draws.map(draw => (
            <tr key={draw.id} className="border-b border-slate-800 hover:bg-slate-800/50">
              <td className="p-2">{draw.id}</td>
              <td className="p-2">{draw.date}</td>
              <td className="p-2">{draw.status}</td>
              <td className="p-2">{draw.winners || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

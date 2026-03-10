import { useState, useEffect } from 'react';
import { Gift, ExternalLink } from 'lucide-react';
import { getResults, type DrawResult } from '../../api/bridge';

export default function DrawManagement() {
  const [results, setResults] = useState<DrawResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResults()
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-bg-surface border border-border-subtle p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Gift /> Gerenciamento de Sorteios</h2>
      
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="p-2">ID</th>
            <th className="p-2">Data</th>
            <th className="p-2">Números Sorteados</th>
            <th className="p-2">Transação</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-text-disabled">Carregando...</td>
            </tr>
          ) : results.length > 0 ? (
            results.map(result => (
              <tr key={result.draw_id} className="border-b border-border-subtle hover:bg-bg-surface/50">
                <td className="p-2 font-mono">#{result.draw_id}</td>
                <td className="p-2">{result.date}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    {result.numbers.map(num => (
                      <span key={num} className="bg-bg-base border border-border-subtle px-2 py-1 rounded text-sm font-mono">{num.toString().padStart(2, '0')}</span>
                    ))}
                  </div>
                </td>
                <td className="p-2">
                  <a
                    href={`https://solscan.io/tx/${result.tx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary-accent hover:underline"
                  >
                    Ver no Solscan <ExternalLink size={16} />
                  </a>
                </td>
              </tr>
            ))
          ) : (
             <tr>
               <td colSpan={4} className="p-4 text-center text-text-disabled">Nenhum sorteio registrado.</td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

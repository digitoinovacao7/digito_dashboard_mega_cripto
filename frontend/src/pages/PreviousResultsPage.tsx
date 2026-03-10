import { ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getResults, type DrawResult } from '../api/bridge';

export default function PreviousResultsPage() {
  const [results, setResults] = useState<DrawResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResults()
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Resultados Anteriores</h1>
      <div className="space-y-4">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          results.map((result) => (
            <div key={result.draw_id} className="bg-bg-surface/50 border border-border-subtle p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Concurso #{result.draw_id} - {result.date}</h2>
                <a
                  href={`https://solscan.io/tx/${result.tx}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-accent hover:underline"
                >
                  Ver Transação <ExternalLink size={16} />
                </a>
              </div>
              <div className="flex justify-center gap-4">
                {result.numbers.map((num) => (
                  <div key={num} className="w-12 h-12 flex items-center justify-center rounded-full bg-bg-surface text-text-primary font-bold text-lg">
                    {num}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

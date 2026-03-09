import { ExternalLink } from 'lucide-react';

const results = [
  {
    date: '08/03/2026',
    numbers: [3, 11, 15, 22, 34, 49],
    tx: '5zXe...y9fA',
  },
  {
    date: '01/03/2026',
    numbers: [5, 12, 23, 33, 41, 50],
    tx: '7aKb...c8gH',
  },
];

export default function PreviousResultsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Resultados Anteriores</h1>
      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.date} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sorteio de {result.date}</h2>
              <a
                href={`https://solscan.io/tx/${result.tx}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-brand-web3 hover:underline"
              >
                Ver Transação <ExternalLink size={16} />
              </a>
            </div>
            <div className="flex justify-center gap-4">
              {result.numbers.map((num) => (
                <div key={num} className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-700 text-white font-bold text-lg">
                  {num}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

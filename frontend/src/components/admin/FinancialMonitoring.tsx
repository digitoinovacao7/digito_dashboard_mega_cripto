import { Wallet, CheckCircle, XCircle } from 'lucide-react';

const pixTxs = [
  { id: 'pix_1', status: 'Success', amount: 'R$ 2,50' },
  { id: 'pix_2', status: 'Success', amount: 'R$ 2,50' },
];

const solanaTxs = [
  { id: 'sol_1', status: 'Success', type: 'Bet' },
  { id: 'sol_2', status: 'Failed', type: 'Bet' },
];

export default function FinancialMonitoring() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Wallet /> Log de Transações PIX</h2>
        <ul>
          {pixTxs.map(tx => (
            <li key={tx.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/50">
              <span>{tx.id} - {tx.amount}</span>
              {tx.status === 'Success' ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Wallet /> Log de Transações On-chain</h2>
        <ul>
          {solanaTxs.map(tx => (
            <li key={tx.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/50">
              <span>{tx.id} - {tx.type}</span>
              {tx.status === 'Success' ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

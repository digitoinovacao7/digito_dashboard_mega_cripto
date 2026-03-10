import { Wallet, CheckCircle, XCircle } from 'lucide-react';

const pixTxs: { id: string, status: string, amount: string }[] = [];
const solanaTxs: { id: string, status: string, type: string }[] = [];

export default function FinancialMonitoring() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-bg-surface border border-border-subtle p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Wallet /> Log de Transações PIX</h2>
        <ul>
          {pixTxs.length > 0 ? (
            pixTxs.map(tx => (
              <li key={tx.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-surface/50">
                <span>{tx.id} - {tx.amount}</span>
                {tx.status === 'Success' ? <CheckCircle className="text-feedback-success" /> : <XCircle className="text-feedback-error" />}
              </li>
            ))
          ) : (
            <li className="text-text-disabled text-sm italic">Nenhuma transação financeira detectada hoje.</li>
          )}
        </ul>
      </div>
      <div className="bg-bg-surface border border-border-subtle p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Wallet /> Log de Transações On-chain</h2>
        <ul>
          {solanaTxs.length > 0 ? (
            solanaTxs.map(tx => (
              <li key={tx.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-surface/50">
                <span>{tx.id} - {tx.type}</span>
                {tx.status === 'Success' ? <CheckCircle className="text-feedback-success" /> : <XCircle className="text-feedback-error" />}
              </li>
            ))
          ) : (
            <li className="text-text-disabled text-sm italic">Aguardando indexação da Blockchain...</li>
          )}
        </ul>
      </div>
    </div>
  );
}

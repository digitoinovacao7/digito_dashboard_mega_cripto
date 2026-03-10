import { Calendar, Clock, Save } from 'lucide-react';
import { useState } from 'react';

export default function NextDrawSettings() {
  const [drawDate, setDrawDate] = useState('');
  const [drawTime, setDrawTime] = useState('');

  const handleSave = () => {
    // TODO: Implementar a chamada à API para salvar a data e hora do próximo sorteio
    alert(`Próximo sorteio agendado para ${drawDate} às ${drawTime}`);
  };

  return (
    <div className="bg-bg-surface border border-border-subtle p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">Agendar Próximo Sorteio</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="draw-date" className="block text-sm font-bold mb-2">
              <Calendar className="inline-block mr-2" size={16} />
              Data do Sorteio
            </label>
            <input
              id="draw-date"
              type="date"
              value={drawDate}
              onChange={(e) => setDrawDate(e.target.value)}
              className="bg-bg-surface border border-border-subtle p-2 rounded-lg w-full"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="draw-time" className="block text-sm font-bold mb-2">
              <Clock className="inline-block mr-2" size={16} />
              Hora do Sorteio
            </label>
            <input
              id="draw-time"
              type="time"
              value={drawTime}
              onChange={(e) => setDrawTime(e.target.value)}
              className="bg-bg-surface border border-border-subtle p-2 rounded-lg w-full"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={!drawDate || !drawTime}
          className="bg-cta-primary hover:bg-feedback-success text-text-primary font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-bg-surface disabled:text-text-disabled disabled:cursor-not-allowed"
        >
          <Save size={16} />
          Salvar Agendamento
        </button>
      </div>
    </div>
  );
}

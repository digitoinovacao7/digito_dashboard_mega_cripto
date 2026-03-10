import { Calendar, Clock, Save } from 'lucide-react';
import { useState } from 'react';

const daysOfWeek = [
  { id: 'seg', label: 'Segunda' },
  { id: 'ter', label: 'Terça' },
  { id: 'qua', label: 'Quarta' },
  { id: 'qui', label: 'Quinta' },
  { id: 'sex', label: 'Sexta' },
  { id: 'sab', label: 'Sábado' },
  { id: 'dom', label: 'Domingo' },
];

export default function NextDrawSettings() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [drawTime, setDrawTime] = useState('19:00');

  const handleDayChange = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
    );
  };

  const handleSave = () => {
    // TODO: Implementar a chamada à API para salvar o agendamento semanal
    const scheduledDays = selectedDays.map(dayId => daysOfWeek.find(d => d.id === dayId)?.label).join(', ');
    alert(`Sorteios agendados para: ${scheduledDays} às ${drawTime}`);
  };

  return (
    <div className="bg-bg-surface border border-border-subtle p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">Agendamento Semanal de Sorteios</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold mb-3">
            <Calendar className="inline-block mr-2" size={16} />
            Dias da Semana para o Sorteio
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {daysOfWeek.map(day => (
              <label
                key={day.id}
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                  selectedDays.includes(day.id)
                    ? 'bg-primary-accent/10 border-primary-accent text-primary-accent'
                    : 'bg-bg-base border-border-subtle hover:border-border-hover'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day.id)}
                  onChange={() => handleDayChange(day.id)}
                  className="h-4 w-4 rounded text-primary-accent focus:ring-primary-accent"
                />
                <span className="font-medium">{day.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="draw-time" className="block text-sm font-bold mb-2">
            <Clock className="inline-block mr-2" size={16} />
            Hora do Sorteio
          </label>
          <input
            id="draw-time"
            type="time"
            value={drawTime}
            onChange={(e) => setDrawTime(e.target.value)}
            className="bg-bg-surface border border-border-subtle p-2 rounded-lg w-full max-w-xs"
          />
        </div>
        
        <button
          onClick={handleSave}
          disabled={selectedDays.length === 0 || !drawTime}
          className="bg-cta-primary hover:bg-feedback-success text-text-primary font-bold py-2 px-4 rounded-lg flex items-center gap-2 disabled:bg-bg-surface disabled:text-text-disabled disabled:cursor-not-allowed"
        >
          <Save size={16} />
          Salvar Agendamento
        </button>
      </div>
    </div>
  );
}

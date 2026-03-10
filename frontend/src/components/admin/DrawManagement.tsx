import { useState } from 'react';
import { Gift, CalendarClock, Save, CheckCircle2 } from 'lucide-react';

const draws: { id: number, date: string, status: string, winners?: number }[] = [];

export default function DrawManagement() {
  const [showSchedule, setShowSchedule] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [day, setDay] = useState("3"); // Quarta-feira
  const [time, setTime] = useState("20:00");

  const handleSaveSchedule = () => {
    setSaving(true);
    // Simula a chamada PUT /api/admin/settings/draw-schedule
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  return (
    <div className="bg-bg-surface border border-border-subtle p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><Gift /> Gerenciamento de Sorteios</h2>
        <button 
          onClick={() => setShowSchedule(!showSchedule)}
          className="bg-bg-surface border border-primary-accent text-primary-accent hover:bg-primary-accent/10 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <CalendarClock className="w-5 h-5" /> Agendamento Automático (Cloud Scheduler)
        </button>
      </div>

      {showSchedule && (
        <div className="bg-bg-surface/50 border border-primary-accent/50 p-6 rounded-xl mb-6 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <CalendarClock className="w-24 h-24 text-primary-accent" />
          </div>
          <h3 className="font-bold mb-1 text-lg flex items-center gap-2">Configurar Sorteio Autônomo</h3>
          <p className="text-text-secondary text-sm mb-4">O Google Cloud Scheduler chamará o endpoint protegido <code className="bg-bg-base px-1 py-0.5 rounded text-primary-accent text-xs">POST /api/internal/trigger-drawing</code> neste horário.</p>
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-auto flex-1">
              <label className="block text-sm font-bold text-text-secondary mb-2">Dia da Semana</label>
              <select 
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full bg-bg-base border border-border-subtle p-3 rounded-lg text-text-primary focus:outline-none focus:border-primary-accent"
              >
                <option value="0">Domingo</option>
                <option value="1">Segunda-feira</option>
                <option value="2">Terça-feira</option>
                <option value="3">Quarta-feira</option>
                <option value="4">Quinta-feira</option>
                <option value="5">Sexta-feira</option>
                <option value="6">Sábado</option>
              </select>
            </div>
            
            <div className="w-full md:w-auto flex-1">
              <label className="block text-sm font-bold text-text-secondary mb-2">Horário (Brasília)</label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-bg-base border border-border-subtle p-3 rounded-lg text-text-primary focus:outline-none focus:border-primary-accent" 
              />
            </div>

            <button 
              onClick={handleSaveSchedule}
              disabled={saving}
              className={`w-full md:w-auto font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                saved 
                  ? 'bg-feedback-success text-bg-base shadow-success' 
                  : 'bg-primary-accent hover:bg-primary-accent/80 text-bg-base shadow-primary'
              }`}
            >
              {saving ? <div className="w-5 h-5 border-2 border-bg-base border-t-transparent rounded-full animate-spin"></div> : null}
              {saved ? <CheckCircle2 className="w-5 h-5" /> : !saving && <Save className="w-5 h-5" />}
              {saving ? 'Sincronizando...' : saved ? 'Cloud Scheduler Atualizado!' : 'Salvar Cronograma'}
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border-subtle flex items-center gap-2 text-xs text-text-secondary">
             <span className="font-mono text-primary-accent bg-primary-accent/10 px-2 py-1 rounded">
               Cron Expr: 0 {time.split(':')[0]} * * {day}
             </span>
             Esta expressão será enviada ao GCP.
          </div>
        </div>
      )}

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="p-2">ID</th>
            <th className="p-2">Data</th>
            <th className="p-2">Status</th>
            <th className="p-2">Ganhadores</th>
          </tr>
        </thead>
        <tbody>
          {draws.length > 0 ? (
            draws.map(draw => (
              <tr key={draw.id} className="border-b border-border-subtle hover:bg-bg-surface/50">
                <td className="p-2">{draw.id}</td>
                <td className="p-2">{draw.date}</td>
                <td className="p-2">{draw.status}</td>
                <td className="p-2">{draw.winners || '-'}</td>
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

import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Trophy, Clock, UserPlus, Gift, TrendingUp, Search, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import CryptoTicker from '../components/CryptoTicker';
import { getAdminStats, type AdminStats } from '../api/bridge';

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState(15); // Em segundos para demonstração
  const [isDrawing, setIsDrawing] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [totalBets, setTotalBets] = useState(0);

  useEffect(() => {
    getAdminStats().then(data => {
      setStats(data);
      setTotalBets(data.totalTickets);
    }).catch(err => console.error("Error loading home stats", err));
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsDrawing(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
      // Simula aumento de apostas nos ultimos segundos
      if (Math.random() > 0.5) setTotalBets(prev => prev + Math.floor(Math.random() * 3));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-24">
      <CryptoTicker />
      {/* Hero Section */}
      <section className="text-center pt-20 pb-12 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-accent/10 text-primary-accent text-sm font-semibold mb-8 border border-primary-accent/20">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-accent"></span>
          </span>
          Rodando na Blockchain Solana
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold max-w-4xl tracking-tight mb-6">
          A loteria transparente que paga no PIX.
        </h1>
        
        <p className="text-xl text-text-secondary max-w-2xl mb-10 font-body">
          O primeiro sorteio 100% auditável por contrato inteligente. 
          Pague em reais, verifique na rede. A sua sorte, matematicamente comprovada.
        </p>
        
        <div className="bg-bg-surface/50 border border-border-subtle p-8 rounded-3xl shadow-2xl mb-12 w-full max-w-3xl">
          <div className="grid md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-border-subtle">
            
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-text-secondary uppercase tracking-widest font-semibold mb-2">Prêmio Estimado</p>
              <div className="text-4xl md:text-6xl font-heading font-black text-accent-gold tracking-tighter">
                R$ {stats ? (stats.volumeBRL * 0.6).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"}
              </div>
              <p className="text-sm font-mono text-text-disabled mt-2">{totalBets} apostas registradas na rede</p>
            </div>

            <div className="flex flex-col items-center justify-center pt-8 md:pt-0">
              <p className="text-sm text-text-secondary uppercase tracking-widest font-semibold mb-2">
                {isDrawing ? "Status do Sorteio" : "Tempo Restante"}
              </p>
              
              {!isDrawing ? (
                <div className="text-5xl md:text-6xl font-mono font-black text-primary-accent tracking-tighter">
                  {formatTime(timeLeft)}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 animate-fade-in">
                   <div className="px-4 py-2 bg-feedback-error/20 border border-feedback-error rounded-lg text-feedback-error font-bold animate-pulse">
                     APOSTAS ENCERRADAS
                   </div>
                   <Link to="/live-draw" className="flex items-center gap-2 text-accent-gold hover:underline font-bold mt-2">
                     <PlayCircle className="w-5 h-5 animate-pulse" /> Acompanhar Sorteio Ao Vivo
                   </Link>
                </div>
              )}
            </div>

          </div>
        </div>
        
        <Link 
          to="/jogar" 
          className={`group flex items-center gap-3 px-8 py-4 rounded-full text-xl font-bold transition-all ${isDrawing ? 'bg-bg-surface text-text-disabled cursor-not-allowed opacity-50' : 'bg-cta-primary hover:bg-feedback-success text-text-primary hover:scale-105 hover:shadow-success'}`}
          onClick={(e) => isDrawing && e.preventDefault()}
        >
          {isDrawing ? 'Aguarde o Próximo Concurso' : 'Cadastre-se para Jogar'}
          {!isDrawing && <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
        </Link>
      </section>

      {/* How it Works */}
      <section className="text-center">
        <h2 className="text-3xl font-heading font-bold mb-10">Como Funciona</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { icon: UserPlus, text: "Cadastre-se com sua conta Google." },
            { icon: Gift, text: "Escolha seus números e pague com PIX." },
            { icon: TrendingUp, text: "Acompanhe o sorteio transparente na blockchain." },
            { icon: Search, text: "Receba prêmios direto na sua conta via PIX!" }
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="p-4 rounded-full bg-bg-surface border border-border-subtle mb-4">
                <step.icon className="w-8 h-8 text-accent-gold" />
              </div>
              <p className="text-text-secondary">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Last Draw Results */}
      <section className="text-center">
        <h2 className="text-3xl font-heading font-bold mb-4">
          {stats?.currentDrawId && Number(stats.currentDrawId) > 1 
            ? `Resultados do Sorteio #${Number(stats.currentDrawId) - 1}` 
            : "Últimos Resultados"}
        </h2>
        
        {stats?.currentDrawId && Number(stats.currentDrawId) > 1 ? (
          <div className="bg-bg-surface/50 border border-border-subtle p-8 rounded-3xl max-w-2xl mx-auto">
            <div className="flex justify-center flex-wrap gap-4 mb-6">
              {[2, 7, 11, 15, 16, 20].map(num => (
                <div key={num} className="w-12 h-12 flex items-center justify-center rounded-full bg-bg-surface text-text-primary font-bold text-lg border border-border-subtle">
                   {num.toString().padStart(2, '0')}
                </div>
              ))}
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-bg-surface text-text-disabled font-bold text-lg border border-border-subtle border-dashed">
                 ...
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-bg-surface text-text-primary font-bold text-lg border border-border-subtle">
                 25
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-bg-base/50 p-4 rounded-xl border border-border-subtle/50">
                <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">15 Acertos</p>
                <p className="text-xl font-bold text-feedback-success">1 ganhador</p>
              </div>
              <div className="bg-bg-base/50 p-4 rounded-xl border border-border-subtle/50">
                <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Rateio</p>
                <p className="text-xl font-bold text-text-primary">R$ 54.210,50</p>
              </div>
              <div className="bg-bg-base/50 p-4 rounded-xl border border-border-subtle/50">
                 <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Auditoria</p>
                 <a href="#" className="text-sm font-mono text-primary-accent hover:underline flex items-center justify-center gap-1 mt-1">
                   Ver Hash ↗
                 </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-bg-surface/50 border border-border-subtle border-dashed p-10 rounded-3xl max-w-2xl mx-auto text-center flex flex-col items-center gap-4">
            <Trophy className="w-12 h-12 text-text-disabled opacity-50" />
            <h3 className="text-xl font-bold text-text-secondary">Aguardando o primeiro sorteio</h3>
            <p className="text-text-disabled font-body">
              Nenhum concurso foi finalizado ainda. Seja o primeiro a participar do nosso pool inicial!
            </p>
          </div>
        )}
      </section>

      {/* Social Proof */}
      <section className="bg-bg-surface/50 py-16 rounded-3xl border border-border-subtle">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold mb-4">Em tempo real na Rede Solana</h2>
          <p className="text-text-secondary">Apenas transações validadas criptograficamente</p>
        </div>
        
        <div className="max-w-4xl mx-auto grid gap-4 px-6">
          {totalBets > 0 ? (
            Array.from({ length: Math.min(3, totalBets) }).map((_, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-subtle hover:border-primary-accent/50 transition-colors shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-primary-accent/20 border border-primary-accent/30">
                    <CheckCircle2 className="text-primary-accent w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">Novo bilhete emitido!</div>
                    <div className="text-xs text-text-disabled font-mono">ID: ...{Math.random().toString(36).substring(7).toUpperCase()} • Aguardando Compensação PIX</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0 text-text-secondary text-sm bg-bg-base border border-border-subtle px-3 py-1 rounded-full w-full md:w-auto justify-center">
                  <Clock className="w-4 h-4" /> Agora
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-bg-surface rounded-xl border border-border-subtle border-dashed">
              <p className="text-text-disabled italic">O pool deste concurso acabou de ser limpo e aguarda a primeira aposta.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 py-10">
        {[
          { icon: Trophy, title: "Prêmios em Pix", desc: "Ganhou? O valor cai direto na sua chave Pix, sem burocracia de exchanges." },
          { icon: CheckCircle2, title: "100% Auditável", desc: "Cada aposta é um registro imutável no ledger da Solana. Não há como fraudar." },
          { icon: ArrowRight, title: "Gasless", desc: "Nós pagamos a taxa da rede. Você só paga o valor da sua aposta em reais." },
        ].map((feature, i) => (
          <div key={i} className="p-6 rounded-2xl bg-gradient-to-b from-bg-surface to-bg-surface/50 border border-border-subtle">
            <feature.icon className="w-10 h-10 text-accent-gold mb-4" />
            <h3 className="text-xl font-bold font-heading mb-2">{feature.title}</h3>
            <p className="text-text-secondary">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

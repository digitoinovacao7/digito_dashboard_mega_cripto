import { ArrowRight, CheckCircle2, Trophy, Clock, UserPlus, Gift, TrendingUp, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="space-y-24">
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
        
        <div className="bg-bg-surface/50 border border-border-subtle p-8 rounded-3xl shadow-2xl mb-12">
          <p className="text-sm text-text-secondary uppercase tracking-widest font-semibold mb-2">Prêmio Estimado</p>
          <div className="text-6xl md:text-8xl font-heading font-black text-accent-gold tracking-tighter">
            R$ 5.000<span className="text-3xl font-bold text-text-disabled">,00</span>
          </div>
        </div>
        
        <Link 
          to="/auth" 
          className="group flex items-center gap-3 bg-cta-primary hover:bg-feedback-success text-text-primary px-8 py-4 rounded-full text-xl font-bold transition-all hover:scale-105 hover:shadow-success"
        >
          Cadastre-se para Jogar
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
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
        <h2 className="text-3xl font-heading font-bold mb-4">Resultados do Último Sorteio</h2>
        <div className="bg-bg-surface/50 border border-border-subtle p-8 rounded-3xl max-w-2xl mx-auto">
          <div className="flex justify-center gap-4 mb-6">
            {[1, 7, 13, 22, 35, 48].map(num => (
              <div key={num} className="w-12 h-12 flex items-center justify-center rounded-full bg-bg-surface text-text-primary font-bold text-lg">{num}</div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-text-secondary">Ganhadores (15 acertos)</p>
              <p className="text-lg font-bold">0</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Ganhadores (14 acertos)</p>
              <p className="text-lg font-bold">12</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Prêmio (14 acertos)</p>
              <p className="text-lg font-bold">R$ 1.234,56</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-bg-surface/50 py-16 rounded-3xl border border-border-subtle">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold mb-4">Em tempo real na Rede</h2>
          <p className="text-text-secondary">Apostas sendo registradas no Smart Contract neste instante</p>
        </div>
        
        <div className="max-w-4xl mx-auto grid gap-4 px-6">
          {[
            { id: "4x9z", time: "Agora mesmo", status: "Confirmado" },
            { id: "7a2b", time: "Há 1 min", status: "Confirmado" },
            { id: "8f1c", time: "Há 3 min", status: "Confirmado" }
          ].map((tx, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-xl bg-bg-surface border border-border-subtle/50 hover:border-primary-accent/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary-accent/20">
                  <CheckCircle2 className="text-primary-accent w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary">Novo bilhete registrado</div>
                  <div className="text-sm text-text-disabled font-mono">TX: ...{tx.id}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0 text-text-secondary text-sm bg-bg-surface px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" /> {tx.time}
              </div>
            </div>
          ))}
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

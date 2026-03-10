import { ShieldCheck, Trophy, Banknote, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-primary-accent/10 rounded-full mb-6 relative">
          <HelpCircle className="w-10 h-10 text-primary-accent absolute animate-ping opacity-20" />
          <HelpCircle className="w-10 h-10 text-primary-accent relative z-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-black mb-6 tracking-tight">
          Como funciona a <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-yellow-300">MegaCripto</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          A loteria mais transparente do mundo, alimentada pela blockchain Solana. Conheça as regras simples que garantem justiça e prêmios rápidos via PIX.
        </p>
      </div>

      <div className="space-y-16">
        
        {/* Como Jogar */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-3">
            <h2 className="text-3xl font-bold font-heading mb-8 flex items-center gap-3">
               <Layers className="text-primary-accent" /> Passo a Passo
            </h2>
          </div>
          
          <div className="bg-bg-surface/50 border border-border-subtle p-8 rounded-3xl hover:-translate-y-2 hover:border-primary-accent/50 transition-all duration-300">
            <div className="text-4xl font-black text-text-disabled mb-4 font-mono">01</div>
            <h3 className="text-xl font-bold font-heading mb-4">Escolha seus Números</h3>
            <p className="text-text-secondary leading-relaxed">
              Vá ao Painel de Aposta e marque **de 15 a 20 números** dentro os 25 disponíveis no nosso inovador volante digital. Quantos mais números, maiores as chances.
            </p>
          </div>

          <div className="bg-bg-surface/50 border border-border-subtle p-8 rounded-3xl hover:-translate-y-2 hover:border-feedback-success/50 transition-all duration-300">
            <div className="text-4xl font-black text-text-disabled mb-4 font-mono">02</div>
            <h3 className="text-xl font-bold font-heading mb-4">Pague Rápido com PIX</h3>
            <p className="text-text-secondary leading-relaxed">
              Esqueça gas rate e exchanges de carteiras complexas. Confirme a aposta e use o escaneamento ou copie a chave PIX para liquidar em segundos via Mercado Pago.
            </p>
          </div>

          <div className="bg-bg-surface/50 border border-border-subtle p-8 rounded-3xl hover:-translate-y-2 hover:border-accent-gold/50 transition-all duration-300">
            <div className="text-4xl font-black text-text-disabled mb-4 font-mono">03</div>
            <h3 className="text-xl font-bold font-heading mb-4">Concorra e Receba</h3>
            <p className="text-text-secondary leading-relaxed">
              Você será premiado se acertar 11, 12, 13, 14 ou o temido prêmio principal de 15 números sorteados. Pagamento direto em reais.
            </p>
          </div>
        </section>

        {/* Premiação & Apostas Múltiplas */}
        <section className="grid lg:grid-cols-2 gap-8">
          
          <div className="bg-gradient-to-br from-bg-surface to-bg-base border border-border-subtle p-8 md:p-10 rounded-3xl shadow-xl">
             <div className="flex items-center gap-4 mb-6">
               <div className="p-3 bg-accent-gold/20 rounded-xl">
                 <Trophy className="w-8 h-8 text-accent-gold" />
               </div>
               <h2 className="text-2xl font-bold font-heading">Rateio de Prêmios</h2>
             </div>
             <p className="text-text-secondary mb-6">
                Do total arrecadado no concurso, 50% é destinado diretamente ao prêmio bruto, que é fracionado da seguinte forma entre as faixas:
             </p>
             <ul className="space-y-4">
               {[
                 { acertos: "15 Acertos", pct: "60%", highlight: true },
                 { acertos: "14 Acertos", pct: "20%", highlight: false },
                 { acertos: "13 Acertos", pct: "10%", highlight: false },
                 { acertos: "12 Acertos", pct: "5%", highlight: false },
                 { acertos: "11 Acertos", pct: "5%", highlight: false },
               ].map((item, idx) => (
                 <li key={idx} className={`flex justify-between items-center p-4 rounded-xl font-mono ${item.highlight ? 'bg-accent-gold/20 border border-accent-gold/30 text-accent-gold font-bold text-lg' : 'bg-bg-surface border border-border-subtle/50 text-text-primary'}`}>
                    <span>{item.acertos}</span>
                    <span>{item.pct}</span>
                 </li>
               ))}
             </ul>
             
             <div className="mt-6 p-4 bg-primary-accent/10 border-l-4 border-primary-accent rounded-r-lg text-sm text-text-secondary">
               <strong>Acumulação:</strong> Caso nenhuma aposta vença qualquer das faixas, esse montante acumula automaticamente para o prêmio máximo do próximo sorteio!
             </div>
          </div>

          <div className="bg-gradient-to-bl from-bg-surface to-bg-base border border-border-subtle p-8 md:p-10 rounded-3xl shadow-xl">
            <div className="flex items-center gap-4 mb-6">
               <div className="p-3 bg-primary-accent/20 rounded-xl">
                 <CheckCircle2 className="w-8 h-8 text-primary-accent" />
               </div>
               <h2 className="text-2xl font-bold font-heading">Chances Multiplicadas</h2>
             </div>
             
             <p className="text-text-secondary mb-6">
                Jogar mais de 15 números significa criar conjuntos de permutações combinatórias inteiras, multiplicando suas chances exponencialmente no oráculo.
             </p>

             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b-2 border-border-subtle text-text-secondary">
                     <th className="py-4 font-heading font-medium">Qtd. Números</th>
                     <th className="py-4 font-heading font-medium">Preço (R$)</th>
                     <th className="py-4 font-heading font-medium">Chance (15 pts)</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border-subtle/50 font-mono text-sm group">
                   <tr className="hover:bg-bg-surface transition-colors">
                     <td className="py-4 pl-2 font-bold font-sans">15</td>
                     <td className="py-4 text-feedback-success">3,50</td>
                     <td className="py-4 text-text-disabled">1 em 3.268.760</td>
                   </tr>
                   <tr className="hover:bg-bg-surface transition-colors">
                     <td className="py-4 pl-2 font-bold font-sans">16</td>
                     <td className="py-4 text-feedback-success">56,00</td>
                     <td className="py-4 text-text-disabled">1 em 204.297</td>
                   </tr>
                   <tr className="hover:bg-bg-surface transition-colors">
                     <td className="py-4 pl-2 font-bold font-sans">17</td>
                     <td className="py-4 text-feedback-success">476,00</td>
                     <td className="py-4 text-text-disabled">1 em 24.035</td>
                   </tr>
                   <tr className="hover:bg-bg-surface transition-colors">
                     <td className="py-4 pl-2 font-bold font-sans">18</td>
                     <td className="py-4 text-feedback-success">2.856,00</td>
                     <td className="py-4 text-text-disabled">1 em 4.005</td>
                   </tr>
                   <tr className="hover:bg-bg-surface transition-colors">
                     <td className="py-4 pl-2 font-bold font-sans">19</td>
                     <td className="py-4 text-feedback-success">13.566,00</td>
                     <td className="py-4 text-text-disabled">1 em 843</td>
                   </tr>
                   <tr className="hover:bg-bg-surface transition-colors">
                     <td className="py-4 pl-2 font-bold font-sans">20</td>
                     <td className="py-4 text-feedback-success">54.264,00</td>
                     <td className="py-4 text-text-disabled">1 em 210</td>
                   </tr>
                 </tbody>
               </table>
               <p className="text-xs text-text-disabled mt-4 text-center">
                 Os preços se baseiam na quantidade de combinações (jogos de 15) geradas por cada seleção.
               </p>
             </div>
          </div>
        </section>

        {/* Garantias de Rede */}
        <section className="grid md:grid-cols-2 gap-8 my-10 pt-10 border-t border-border-subtle">
           <div className="flex gap-6">
             <div className="flex-shrink-0">
               <div className="w-16 h-16 rounded-2xl bg-feedback-success/20 flex items-center justify-center border border-feedback-success/30">
                 <Banknote className="w-8 h-8 text-feedback-success" />
               </div>
             </div>
             <div>
               <h3 className="text-2xl font-bold font-heading mb-2">Liquidação Pix 100% Automática</h3>
               <p className="text-text-secondary">
                 Ganhador não precisa enviar tickets ao suporte. Após finalização de sorteio da Solana, os fundos da tesouraria do projeto transferem simultaneamente em até 24hrs os PIX das fatias direto pra chave de seu cadastro!
               </p>
             </div>
           </div>

           <div className="flex gap-6">
             <div className="flex-shrink-0">
               <div className="w-16 h-16 rounded-2xl bg-text-primary/10 flex items-center justify-center border border-text-disabled/30">
                 <ShieldCheck className="w-8 h-8 text-text-primary" />
               </div>
             </div>
             <div>
               <h3 className="text-2xl font-bold font-heading mb-2">Transparência Irrefutável</h3>
               <p className="text-text-secondary">
                 Não existe "botão escondido". Todo sorteio envia uma requisição para a poderosa malha Oráculo <strong>Chainlink VRF</strong>, exigindo matemática em on-chain imutável que qualquer um pode rastrear na rede.
               </p>
             </div>
           </div>
        </section>

      </div>
    </div>
  );
}

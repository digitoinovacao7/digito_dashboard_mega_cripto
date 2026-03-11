import { ShieldAlert } from 'lucide-react';


export default function ResponsibleGamingPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center gap-3 justify-center mb-8">
        <ShieldAlert className="w-10 h-10 text-primary-accent" />
        <h1 className="text-4xl font-heading font-black text-center text-text-primary">Política de Jogo Responsável</h1>
      </div>
      
      <div className="bg-bg-surface/80 border border-border-subtle rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 text-text-secondary leading-relaxed font-body">
        
        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">1. Nosso Compromisso</h2>
          <p>
            A Mega Cripto está comprometida em apoiar o Jogo Responsável como uma política de atendimento ao cliente e responsabilidade social. Acreditamos que é nossa responsabilidade para com você, nosso cliente, garantir que você desfrute da sua experiência de aposta em nosso site, mantendo-se plenamente consciente dos possíveis danos sociais e financeiros associados a problemas com o jogo.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">2. Sinais de Alerta</h2>
          <p className="mb-4">O jogo pode ser prejudicial se não for mantido sob controle. Preste atenção aos seguintes sinais:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Você gasta mais tempo ou dinheiro jogando do que pode pagar.</li>
            <li>O jogo está afetando seus relacionamentos, desempenho no trabalho ou estudos.</li>
            <li>Você joga para recuperar perdas financeiras passadas.</li>
            <li>Você sente a necessidade de mentir sobre seus hábitos de jogo.</li>
            <li>O jogo se tornou uma fuga para problemas emocionais ou ansiedade.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">3. Ferramentas de Autocontrole</h2>
          <p className="mb-4">Para ajudar nossos jogadores a jogarem de forma responsável, oferecemos em sua área de Perfil as seguintes ferramentas:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Autoexclusão:</strong> Você pode suspender temporariamente (ex: 7 dias) ou permanentemente sua conta, impossibilitando novas apostas durante este período.</li>
            <li><strong>Limites de Aposta:</strong> Permite definir um valor máximo de apostas (em R$) por dia ou por mês para manter seu controle financeiro.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">4. Procure Ajuda</h2>
          <p>
            Se você acha que você ou alguém que você conhece tem um problema com jogo, recomendamos que procure ajuda profissional imediatamente. No Brasil, o <strong>Jogadores Anônimos do Brasil (JA)</strong> oferece reuniões e suporte para indivíduos tentando se recuperar de problemas com jogo (visite <a href="https://jogadoresanonimos.com.br" target="_blank" rel="noopener noreferrer" className="text-cta-primary hover:underline">jogadoresanonimos.com.br</a>).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">5. Proteção de Menores</h2>
          <p>
            É estritamente proibido o uso da Mega Cripto por pessoas menores de 18 anos. Recomendamos que os pais e responsáveis apliquem filtros em navegadores para evitar o acesso de menores a plataformas de aposta. Nossa estrutura de KYC (Conheça Seu Cliente) previne retiradas por menores.
          </p>
        </section>

      </div>
    </div>
  );
}

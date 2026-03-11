
export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-heading font-black text-center text-text-primary mb-8">Política de Privacidade</h1>
      
      <div className="bg-bg-surface/80 border border-border-subtle rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 text-text-secondary leading-relaxed font-body">
        
        <p className="text-sm italic">Última atualização: Março de 2026</p>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">1. Coleta e Finalidades</h2>
          <p>
            Em conformidade com a LGPD (Lei Geral de Proteção de Dados) número 13.709/2018, a Mega Cripto ("Nós" ou "Nossa") coleta dados pessoais precisos (como seu CPF e-mail, nome, chave PIX e endereço IP) para possibilitar:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Identificação legal, prevenindo a ação de fraude ou apostas por menores de idade.</li>
            <li>Condução das transações via PIX (Pagamentos e Saques) e gestão de carteiras on-chain.</li>
            <li>Envio de comprovantes e comunicação de novos prêmios ou segurança contínua.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">2. Proteção de Dados (Armazenamento Criptografado)</h2>
          <p>
            Processamos todos os dados usando as melhores práticas de cibersegurança do mercado e armazenamos a sua informação on-cloud com suporte e protocolos de segurança (tais como TSL/SSL) protegendo qualquer requisição e transação, independentemente se são pagamentos (API Mercado Pago ou Redes de Blockchain) ou identificações sociais (Oauth Auth Firebase e Criptografia Web3).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">3. Política de Compartilhamento</h2>
          <p>
            Nenhum dos seus dados sensíveis será trocado, repassado com fins publicitários independentes ou vendido a terceiros sob quaisquer termos. Podemos apenas divulgar informações às autoridades mediante solicitações judiciais pertinentes da Receita Federal ou outros órgãos em compliance para proteção e prevenção legal a Fraude.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">4. Direitos do Jogador (LGPD)</h2>
          <p className="mb-4">
            A Lei lhe oferece o direito contínuo a:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Requisitar e Acessar dados retidos por nós.</li>
            <li>Solicitar Retificação ou Modificação nas informações cadastrais.</li>
            <li>Pleitear a Remoção Completa das suas contas e registros off-chain e on-chain que nos for cedido juridicamente possível (dados públicos em blockchains são perenes independentemente da nossa infraestrutura).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">Contato do DPO (Data Protection Officer)</h2>
          <p>
            Para sanar dúvidas sobre sua privacidade e nossos limites de custódia, contate o nosso DPO exclusivo por meio de <code>privacidade@megacripto.app</code>.
          </p>
        </section>

      </div>
    </div>
  );
}

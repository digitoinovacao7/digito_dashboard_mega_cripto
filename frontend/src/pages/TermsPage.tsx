
export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-heading font-black text-center text-text-primary mb-8">Termos de Uso e Condições Gerais</h1>
      
      <div className="bg-bg-surface/80 border border-border-subtle rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8 text-text-secondary leading-relaxed font-body">
        
        <p className="text-sm italic">Última atualização: Março de 2026</p>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou usar a plataforma Mega Cripto, você concorda expressamente em ficar vinculado a estes Termos de Uso e Condições. Se você não concorda com alguma parte destes termos, não deverá acessar nem jogar na plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">2. Requisitos de Elegibilidade</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Você deve ter <strong>18 (dezoito) anos ou mais</strong> para criar uma conta e participar de qualquer sorteio.</li>
            <li>Você deve residir no Brasil ou ter um CPF válido para participar e receber os pagamentos de prêmios gerados localmente via PIX.</li>
            <li>Você é responsável por declarar e pagar eventuais impostos incidentes sobre os prêmios recebidos de acordo com a legislação brasileira.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">3. Regras do Sorteio</h2>
          <p>
            Cada sorteio ("Concurso") sorteia 15 números sem repetição a partir de um pool total de 25 números. As faixas de apuração compreendem 15, 14 e 13 acertos absolutos. Detalhes completos das probabilidades e prêmios encontram-se expostos abertamente na página correspondente da plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">4. A Plataforma como Agente Facilitador</h2>
          <p>
            A Mega Cripto faz uso de smart contracts na blockchain da Solana para tornar a execução e a guarda das transações imutáveis, provendo transparência irrefutável (auditoria transparente). Contudo, todas as apostas e prêmios ocorrem e são processados em Reais Brasileiros (BRL) usando a tecnologia financeira convencional (PIX Mercado Pago). Nós não somos uma corretora de criptoativos e nenhum ativo encriptado é negociado com o usuário.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-heading text-text-primary mb-4 border-b border-border-subtle pb-2">5. Pagamentos e Retiradas</h2>
          <p>
            Para pagamentos efetuados pelo usuário, deve ser respeitado o prazo operacional das chaves PIX de registro bancário. Se o tempo do sorteio se esgotar antes do processamento oficial pelo nosso gateway de pagamentos parceiro, a sua compra não será validada para o sorteio atual.
            <br/><br/>
            Para transferências do prêmio, exige-se o cadastro ativo de uma <span className="font-bold">Chave PIX válida</span> registrada sob a sua titularidade e previamente atrelada ao seu sistema na Mega Cripto. Prêmios não reclamados e não transferíveis ou não preenchidos no âmbito de 90 dias após a finalização do concurso expiram em favor do acúmulo da plataforma (jackpot).
          </p>
        </section>

      </div>
    </div>
  );
}

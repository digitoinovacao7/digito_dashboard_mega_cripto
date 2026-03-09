export default function RulesPage() {
  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold mb-4">Regras do Jogo: Mega Cripto UAI</h1>
      </div>
      <div className="prose prose-invert mx-auto">
        <h2>Como Jogar</h2>
        <p>Participe da Mega Cripto UAI, a loteria com a transparência da blockchain e a facilidade que você já conhece!</p>
        <ul>
          <li><strong>Escolha seus números:</strong> Marque de 15 a 20 números, entre os 25 disponíveis no volante digital.</li>
          <li><strong>Pague com PIX:</strong> Confirme sua aposta e pague de forma rápida e segura com PIX.</li>
          <li><strong>Concorra a prêmios em dinheiro:</strong> Você ganha ao acertar 11, 12, 13, 14 ou 15 dos números sorteados.</li>
        </ul>

        <h2>Apostas Múltiplas (Opcional)</h2>
        <p>Para aumentar suas chances de ganhar, você pode jogar com mais de 15 números. Ao fazer isso, você está criando múltiplas combinações de apostas. Veja como o preço e suas chances melhoram:</p>
        <table>
          <thead>
            <tr>
              <th>Quantidade de números</th>
              <th>Valor da aposta</th>
              <th>Probabilidade de 15 acertos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>15</td>
              <td>R$ 3,50</td>
              <td>1 em 3.268.760</td>
            </tr>
            <tr>
              <td>16</td>
              <td>R$ 56,00</td>
              <td>1 em 204.297</td>
            </tr>
            <tr>
              <td>...</td>
              <td>...</td>
              <td>...</td>
            </tr>
          </tbody>
        </table>
        <p><em>(Nota: Os valores e probabilidades para 17+ números serão exibidos na tela de aposta.)</em></p>

        <h2>Premiação</h2>
        <p>O prêmio bruto corresponde a 50% do total arrecadado em cada concurso. Esse valor é distribuído entre os ganhadores da seguinte forma:</p>
        <ul>
          <li><strong>15 acertos:</strong> 60% do valor total do prêmio</li>
          <li><strong>14 acertos:</strong> 20% do valor total do prêmio</li>
          <li><strong>13 acertos:</strong> 10% do valor total do prêmio</li>
          <li><strong>12 acertos:</strong> 5% do valor total do prêmio</li>
          <li><strong>11 acertos:</strong> 5% do valor total do prêmio</li>
        </ul>

        <h2>Acumulação</h2>
        <p>Se não houver aposta ganhadora em qualquer faixa de premiação, o valor destinado àquela faixa acumula para o prêmio principal (15 acertos) do concurso seguinte.</p>

        <h2>Pagamento dos Prêmios</h2>
        <p>Os prêmios são pagos <strong>automaticamente via PIX</strong> na chave que você cadastrou em seu perfil. O pagamento é processado em até 24 horas após a apuração do sorteio. Simples e direto na sua conta!</p>

        <h2>Transparência Total (Nosso Compromisso)</h2>
        <p>A sua confiança é nossa prioridade. Todo o processo é 100% auditável:</p>
        <ul>
          <li><strong>Apostas Imutáveis:</strong> Cada aposta paga é registrada permanentemente na blockchain da Solana antes do sorteio.</li>
          <li><strong>Sorteio Justo:</strong> Os números são sorteados de forma automática e imparcial por um smart contract, utilizando o Chainlink VRF (Verifiable Random Function), uma tecnologia líder de mercado que garante a geração de números aleatórios de forma comprovadamente justa e livre de manipulação.</li>
        </ul>
      </div>
    </div>
  );
}

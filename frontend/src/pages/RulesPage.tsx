export default function RulesPage() {
  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading font-bold mb-4">Regras do Jogo (Mega Cripto UAI)</h1>
      </div>
      <div className="prose prose-invert mx-auto">
        <h2>Como jogar</h2>
        <p>Jogue na Mega Cripto UAI e concorra a prêmios em cripto!</p>
        <p>A Mega Cripto UAI é um jogo de loteria baseado na blockchain da Solana, o que garante transparência e segurança.</p>
        <ul>
          <li><strong>Escolha seus números:</strong> marque 15 números dentre os 25 disponíveis no volante.</li>
          <li><strong>Ganhe prêmios:</strong> fature prêmios ao acertar 11, 12, 13, 14 ou 15 números.</li>
        </ul>

        <h2>Premiação</h2>
        <p>O prêmio total é formado por 50% de toda a arrecadação. A distribuição é feita da seguinte forma:</p>
        <ul>
          <li><strong>15 acertos:</strong> 60% do prêmio total</li>
          <li><strong>14 acertos:</strong> 20% do prêmio total</li>
          <li><strong>13 acertos:</strong> 10% do prêmio total</li>
          <li><strong>12 acertos:</strong> 5% do prêmio total</li>
          <li><strong>11 acertos:</strong> 5% do prêmio total</li>
        </ul>

        <h2>Tabela de preços</h2>
        <table>
          <thead>
            <tr>
              <th>Quantidade de números</th>
              <th>Valor de aposta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>15</td>
              <td>R$ 3,50</td>
            </tr>
          </tbody>
        </table>

        <h2>Probabilidade</h2>
        <table>
          <thead>
            <tr>
              <th>Faixas de premiação</th>
              <th>15 números (1 aposta)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>15 ACERTOS</strong></td>
              <td>1 em 3.268.760</td>
            </tr>
            <tr>
              <td><strong>14 ACERTOS</strong></td>
              <td>1 em 21.792</td>
            </tr>
            <tr>
              <td><strong>13 ACERTOS</strong></td>
              <td>1 em 692</td>
            </tr>
            <tr>
              <td><strong>12 ACERTOS</strong></td>
              <td>1 em 60</td>
            </tr>
            <tr>
              <td><strong>11 ACERTOS</strong></td>
              <td>1 em 11</td>
            </tr>
          </tbody>
        </table>

        <h2>Acumulação</h2>
        <p>Não havendo ganhador em qualquer faixa de premiação, o valor acumula para o concurso seguinte, na mesma faixa de premiação.</p>

        <h2>Pagamentos</h2>
        <p>Os prêmios são pagos automaticamente na sua carteira de criptomoedas (criada no seu primeiro acesso) em até 24 horas após o sorteio.</p>

        <h2>Transparência</h2>
        <p>Os sorteios são realizados de forma automática e transparente através de um smart contract na blockchain da Solana. Os números são gerados de forma aleatória e auditável, utilizando um oráculo Chainlink (VRF - Verifiable Random Function).</p>
      </div>
    </div>
  );
}

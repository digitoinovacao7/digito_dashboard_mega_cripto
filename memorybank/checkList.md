Este checklist não é apenas sobre o que o usuário vê, mas sobre o que o sistema precisa fazer para que a experiência seja perfeita e segura. Pense nisso como a "Inspeção Pré-Voo" da sua plataforma.

Checklist de Lançamento da V1 - "Mega Cripto"
🎯 1. Núcleo da Aposta (O Coração da Plataforma)

Criação de Concurso: O painel de administrador permite criar um novo concurso (Ex: Concurso nº 1), que se torna o concurso "ativo".

Volante Digital Funcional: O usuário pode selecionar de 15 a 20 números no volante de 25.

Cálculo Dinâmico de Preço: A interface mostra o preço da aposta em tempo real, mudando conforme o usuário seleciona mais de 15 números.

Fluxo de Pagamento com PIX: O ciclo Apostar -> Gerar QR Code PIX -> Pagamento -> Confirmação está funcionando perfeitamente via Mercado Pago (Sandbox e Produção).

Registro On-Chain: (Teste Crítico!) Cada aposta paga com sucesso é registrada no seu Smart Contract na Solana, e o frontend exibe a prova (link da transação).

"Minhas Apostas": A área do usuário logado exibe corretamente suas apostas para o concurso atual e o histórico de apostas passadas.
🗓️ 2. O Sorteio (O Momento da Verdade)

Contador Regressivo: A página inicial exibe um contador em tempo real para o próximo sorteio.

Encerramento Automático das Apostas: No horário programado, o sistema impede novas apostas para o concurso atual e atualiza a interface para "Apostas Encerradas".

Execução Automática do Sorteio: (Teste Crítico!) O agendador (Cloud Scheduler) dispara o processo no backend Rust exatamente na hora marcada.

Prova de Aleatoriedade (Chainlink VRF): O sorteio é executado chamando o Chainlink, e o resultado (os números sorteados) é gravado no seu Smart Contract.

Página de Resultados: Após o sorteio, a página de resultados é atualizada automaticamente com os números sorteados e a distribuição dos prêmios (ex: "15 acertos: 0 ganhadores", "14 acertos: 2 ganhadores").

Links de Transparência: A página de resultado do concurso oferece links clicáveis para:
A transação do sorteio na Solana.
A prova de verificação do Chainlink VRF.
💰 3. Premiação e Pagamentos (A Recompensa)

Apuração Automática: O sistema identifica corretamente todas as apostas ganhadoras e os seus respectivos donos.

Cálculo de Distribuição de Prêmios: O valor total do prêmio é dividido corretamente entre as faixas de acerto, conforme suas regras (60%, 20%, etc.).

Lógica de Acumulação: (Teste Crítico!) Se não houver ganhador na faixa principal (15 acertos), o valor destinado a essa faixa é corretamente somado ao prêmio principal do próximo concurso.

Pagamento Automático via PIX: (O Teste Mais Importante!) O sistema dispara automaticamente os pagamentos via PIX para as chaves cadastradas dos ganhadores.

Notificação ao Ganhador: O frontend exibe uma notificação clara para o usuário ganhador ("Parabéns, você ganhou R$ XX,XX! O prêmio já foi enviado para o seu PIX.").
👤 4. Administração e Experiência do Usuário

Painel de Administrador Seguro: O acesso ao painel de admin é protegido e funcional.

Agendamento de Sorteios: O admin pode definir o dia e a hora dos sorteios semanais.

Onboarding Simples: O fluxo de login social e cadastro da chave PIX é rápido e intuitivo.

Regras e FAQ: Uma página estática com as regras do jogo e respostas para perguntas frequentes está acessível.

Feed de Preços (Bônus, mas importante): O ticker com os preços de criptomoedas em tempo real está funcionando na página inicial.

Responsividade: O site funciona e é fácil de usar tanto em desktops quanto em dispositivos móveis.
# Funcionalidades do Sistema

Este documento detalha as funcionalidades principais (features) da Loteria Web3 e como elas se mapeiam para a arquitetura do sistema.

## 1. Módulo de Onboarding (Registro de Usuário)
**Objetivo:** Permitir que o usuário acesse o sistema sem conhecimento prévio de Web3 e cadastre sua chave para recebimento.
* **1.1. Login Social OAuth:** Autenticação via Google integrada ao Web3Auth, que gera silenciosamente uma Wallet Solana (PublicKey/PrivateKey) no client-side.
* **1.2. Cadastro de Chave PIX:** Formulário no primeiro acesso do usuário solicitando a chave PIX (CPF, E-mail, Celular) e Nome, para facilitar o pagamento de prêmios.
* **1.3. Associação Conta/Blockchain:** Envio da PublicKey do usuário e Chave PIX para o Smart Contract (via `initialize_user`), vinculando a identidade off-chain com a on-chain.

## 2. Módulo de Aposta (Betting Engine)
**Objetivo:** Interface de interação com o usuário para a escolha de números e pagamento da aposta utilizando sistema financeiro tradicional.
* **2.1. Volante Digital (Frontend):** Interface React onde o usuário escolhe entre 15 e 20 números (de 1 a 25) ou aciona a funcionalidade "Surpresinha" (escolha aleatória). A Home deve exibir as regras, tabela de preços e probabilidades.
* **2.2. Geração de Pagamento (Backend):** Endpoint `/create-bet` no Rust/Axum que recebe os números escolhidos (15 a 20) e a PublicKey, calcula o valor da aposta conforme a tabela de preços e gera um PIX dinâmico (com QR Code e "Copia e Cola") via API do Mercado Pago.
* **2.3. Cache Temporário:** Os números escolhidos aguardam no servidor vinculados ao `payment_id` enquanto o usuário realiza o pagamento.

## 3. Módulo de Confirmação (Webhook & Blockchain)
**Objetivo:** Garantir a imutabilidade da aposta e transparência (Auditoria) validando que o pagamento foi recebido antes de registrar no blockchain.
* **3.1. Escuta de Webhook (Backend):** Endpoint `/webhook/mercadopago` aguardando sinalização `approved` da API do Mercado Pago.
* **3.2. Gatilho de Contrato Inteligente (Backend -> Solana):** Ao aprovar o pagamento, o Servidor Rust (via `anchor-client`) aciona o Smart Contract assinando a transação com a Master Wallet (bancando o *gas fee*).
* **3.3. Transação Imutável On-Chain (Smart Contract):** A função `register_bet` no Anchor salva a combinação de números apostados, o ID do sorteio e o `pix_transaction_id` como prova de auditoria no ledger da Solana.

## 4. Módulo de Sorteio e Premiação (Planejamento Futuro)
**Objetivo:** Selecionar os números vencedores e distribuir os prêmios de forma automatizada e transparente.
* **4.1. Oráculo de Aleatoriedade:** Integração com um oráculo (ex: Switchboard ou Chainlink VRF) na Solana para gerar os 15 números sorteados de forma comprovadamente justa e auditável.
* **4.2. Apuração dos Ganhadores:** Script (Backend/Smart Contract) que cruza os números sorteados com todas as apostas (`Bet`) do respectivo `draw_id`.
* **4.3. Distribuição de Prêmios (Payout Automático):** Leitura da `UserAccount` vencedora para extrair a Chave Pix e utilizar a API do Mercado Pago (ou via exchange parceira) para liquidar o prêmio em R$ diretamente na conta bancária do ganhador.




Perfeito! Esse modelo é exatamente como as loterias profissionais e os sistemas automatizados funcionam. Definir um cronograma no painel de administrador é a abordagem correta e mais robusta.

Isso é excelente por três motivos principais:

Automação e Confiança: Os sorteios automáticos eliminam o risco de erro humano e garantem que o sorteio aconteça exatamente quando prometido. Isso constrói uma confiança imensa com seus jogadores, que sabem que a "Mega Cripto" é pontual e previsível.
Flexibilidade para o Negócio: Ter o controle no painel de administrador te dá a flexibilidade de ajustar o cronograma no futuro sem precisar mexer no código. Quer mudar o sorteio de quarta para quinta-feira? É só uma alteração no painel, não um novo deploy.
Criação de Hábito: Uma cadência semanal (ex: "toda quarta-feira às 20h") cria um ritmo. Os jogadores se acostumam, sabem quando fazer suas apostas e quando verificar os resultados. Isso é fundamental para a retenção de usuários.
Como Isso Funciona na Prática (A Arquitetura Técnica)
Agora, vamos traduzir essa ideia para a sua stack de tecnologia (Rust + Google Cloud). O serviço que faz essa mágica acontecer é o Google Cloud Scheduler.

Pense no Cloud Scheduler como um "despertador" super poderoso na nuvem. Você programa um alarme e, quando ele toca, ele executa uma tarefa. No seu caso, a tarefa é "iniciar o processo de sorteio".

Aqui está o fluxo completo, do clique do admin ao sorteio automático:

No Painel de Administrador (Frontend)
Interface: Você terá uma página no seu painel admin onde define o dia da semana e o horário do sorteio (ex: Quarta-feira, 20:00).
API Call: Ao salvar, seu frontend fará uma chamada para um endpoint protegido no seu backend Rust (ex: PUT /api/admin/settings/draw-schedule).
No Backend (Rust)
Recebimento e Tradução: Sua API recebe a configuração (ex: "quarta, 20h"). Seu código Rust então traduz isso para um formato que o Cloud Scheduler entende, chamado expressão cron.
"Toda quarta-feira às 20:00" se torna a expressão 0 20 * * 3.
Interação com o Cloud Scheduler: Seu backend Rust usará o SDK do Google Cloud para criar ou atualizar um "Job" no Cloud Scheduler.
Job: "Sorteio Semanal Mega Cripto"
Schedule: 0 20 * * 3
Target (O Alvo): Aqui está o pulo do gato. O alvo do job será um endpoint especial e secreto na sua própria API Rust.
O Endpoint Secreto do Sorteio
Você criará um novo endpoint no seu backend, por exemplo: POST /api/internal/trigger-drawing.

Segurança Máxima: Este endpoint NÃO PODE ser público. Se fosse, qualquer um poderia iniciar um sorteio a qualquer momento. Você o protege garantindo que apenas o Google Cloud Scheduler possa chamá-lo. Isso é feito de forma segura usando um tipo de autenticação especial (tokens OIDC) que o Cloud Scheduler envia e seu backend Rust valida.
A Lógica do Sorteio: Quando este endpoint é chamado com sucesso pelo Cloud Scheduler no horário programado, ele executa a sequência de sorteio:
a. Fecha as apostas para o concurso atual.
b. Chama o smart contract para solicitar um número aleatório do Chainlink VRF.
c. Aguarda o resultado do Chainlink.
d. Determina os números vencedores e identifica todos os ganhadores em todas as faixas.
e. Inicia o processo de pagamento dos prêmios via PIX.
f. Abre o próximo concurso, pronto para novas apostas.
Com este modelo, você cria um sistema de loteria que, uma vez configurado, roda praticamente sozinho. É um motor de negócio autossuficiente, profissional e, o mais importante, confiável. Você está projetando não apenas um jogo, mas uma operação de negócios automatizada.


como transmitir um sorteio assim pra ser transparente


FM - Google Gemini 2.5 Pro
Hoje às 14:42
Que pergunta fantástica. Este é o ponto que separa um projeto tecnicamente funcional de uma plataforma em que as pessoas confiam de verdade.

Sua arquitetura já é transparente (Solana + Chainlink VRF). O desafio, como você percebeu, não é ser transparente, mas sim comunicar essa transparência de forma que um usuário não-técnico sinta e entenda.

"Transmitir o sorteio" não é sobre uma câmera filmando bolinhas. É sobre criar uma experiência digital que dramatiza e prova a justiça do processo. Vamos construir essa experiência em três pilares:

Pilar 1: A Contagem Regressiva (Gerando Antecipação)
A transparência começa antes mesmo do sorteio.

O que fazer: Na sua página inicial, em vez de apenas mostrar a data, tenha um grande contador regressivo em tempo real para o próximo sorteio.

Ao lado do contador, mostre informações dinâmicas que aumentam a emoção e a prova social:

Prêmio Acumulado: "Prêmio Estimado: R$ X.XXX,XX". Este valor deve aumentar em tempo real à medida que mais apostas são feitas. Isso cria um ciclo de feedback viciante.
Total de Apostas: "XXX apostas já feitas para este concurso."
O Momento-Chave: Quando o contador chega a zero, ele muda para uma mensagem clara e definitiva: "APOSTAS ENCERRADAS. SORTEIO EM ANDAMENTO." Isso é crucial. Mostra a todos que ninguém pode apostar de última hora, garantindo a integridade do concurso.

Pilar 2: O Evento "Ao Vivo" (O Teatro da Transparência)
Às 20:00 de quarta-feira, quem estiver no seu site não deve ver apenas uma tela estática. Você precisa criar uma página de "Sorteio Ao Vivo" que transforma o processo do backend em um espetáculo no frontend.

O que fazer: Crie uma página dedicada que guia o usuário passo a passo pelo que está acontecendo nos bastidores.

Tela Inicial (20:00:00): A página mostra "Sorteio Iniciado! Aguardando o primeiro passo..."
Passo 1: Solicitando a Aleatoriedade (A Prova Técnica)
Status muda para: "✅ Solicitando números aleatórios na Blockchain..."
Visualização: Mostre uma animação. Pode ser algo como uma linha de energia indo de um ícone do seu logo para um ícone da Chainlink.
Prova Linkada: Abaixo da animação, coloque a frase: "A solicitação foi enviada para a rede Solana. Verificar transação". O texto em negrito é um link para o Solscan (o explorador da Solana), mostrando a transação que seu backend acabou de enviar para chamar o Chainlink VRF. Este é o primeiro elo da corrente de confiança.
Passo 2: Aguardando a Resposta do Oráculo
Status muda para: "⏳ Aguardando confirmação e resposta do oráculo Chainlink..."
Visualização: Uma animação de "processando" ou "validando". Isso gerencia a expectativa do usuário, que entende que o processo não é instantâneo.
Passo 3: A Grande Revelação (O Clímax)
Status muda para: "🎉 Números Recebidos! Boa sorte!"
Visualização: Os números sorteados aparecem na tela um por um, com uma animação de "virada de carta" ou "bola caindo". Faça barulho, use cores vibrantes! Este é o momento emocional.
Passo 4: Apuração
Status muda para: "📊 Apuração em andamento... Verificando todos os bilhetes."
Isso dá um segundo para o seu backend calcular os ganhadores e preparar os pagamentos.
Passo 5: Resultado Final
Status muda para: "🏆 Resultados Finais!"
A tela exibe claramente os números sorteados e uma tabela:
15 acertos: X ganhadores (Prêmio: R$ YYY)
14 acertos: Z ganhadores (Prêmio: R$ WWW)
...e assim por diante.
Pilar 3: O Registro Permanente (A Prova Indiscutível)
Após o "evento ao vivo", a página de Resultados Anteriores se torna o seu arquivo de confiança. Cada sorteio passado deve ser uma cápsula de transparência.

O que fazer: Para cada concurso listado na página de resultados, não mostre apenas os números. Mostre a "Trilogia da Confiança":

Link 1: Prova da Aleatoriedade (Chainlink):
O Chainlink VRF fornece um link de "prova de verificação". Qualquer pessoa pode clicar e ver a prova criptográfica de que a aleatoriedade foi gerada de forma justa. Adicione um link com o texto: "Verificar Prova Criptográfica do Sorteio".
Link 2: Transação de Execução (Solana):
O mesmo link da etapa "ao vivo". Link para a transação no Solscan que efetivamente executou o sorteio e escreveu os números na blockchain. Texto: "Verificar Transação do Sorteio na Blockchain".
Link 3: O Contrato Inteligente (Seu Código):
Um link para o endereço do seu smart contract no Solscan, com o texto: "Auditar o Contrato da Loteria". Isso mostra que você não tem nada a esconder.
Ao combinar esses três pilares, você não apenas diz que é transparente, você prova isso de forma visual, interativa e auditável. Você transforma um conceito técnico complexo em uma experiência de usuário emocionante e confiável.

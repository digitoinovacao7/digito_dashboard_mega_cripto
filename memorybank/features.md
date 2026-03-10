# Funcionalidades do Sistema

Este documento detalha as funcionalidades principais (features) da Loteria Web3 e como elas se mapeiam para a arquitetura do sistema.

## 1. Módulo de Onboarding (Registro de Usuário)

**Objetivo:** Permitir que o usuário acesse o sistema sem conhecimento prévio de Web3 e cadastre sua chave para recebimento.

- **1.1. Login Social OAuth:** Autenticação via Google integrada ao Web3Auth, que gera silenciosamente uma Wallet Solana (PublicKey/PrivateKey) no client-side.
- **1.2. Cadastro de Chave PIX:** Formulário no primeiro acesso do usuário solicitando a chave PIX (CPF, E-mail, Celular) e Nome, para facilitar o pagamento de prêmios.
- **1.3. Associação Conta/Blockchain:** Envio da PublicKey do usuário e Chave PIX para o Smart Contract (via `initialize_user`), vinculando a identidade off-chain com a on-chain.

## 2. Módulo de Aposta (Betting Engine)

**Objetivo:** Interface de interação com o usuário para a escolha de números e pagamento da aposta utilizando sistema financeiro tradicional.

- **2.1. Volante Digital (Frontend):** Interface React onde o usuário escolhe entre 15 e 20 números (de 1 a 25) ou aciona a funcionalidade "Surpresinha" (escolha aleatória). A Home deve exibir as regras, tabela de preços e probabilidades.
- **2.2. Geração de Pagamento (Backend):** Endpoint `/create-bet` no Rust/Axum que recebe os números escolhidos (15 a 20) e a PublicKey, calcula o valor da aposta conforme a tabela de preços e gera um PIX dinâmico (com QR Code e "Copia e Cola") via API do Mercado Pago.
- **2.3. Cache Temporário:** Os números escolhidos aguardam no servidor vinculados ao `payment_id` enquanto o usuário realiza o pagamento.

## 3. Módulo de Confirmação (Webhook & Blockchain)

**Objetivo:** Garantir a imutabilidade da aposta e transparência (Auditoria) validando que o pagamento foi recebido antes de registrar no blockchain.

- **3.1. Escuta de Webhook (Backend):** Endpoint `/webhook/mercadopago` aguardando sinalização `approved` da API do Mercado Pago.
- **3.2. Gatilho de Contrato Inteligente (Backend -> Solana):** Ao aprovar o pagamento, o Servidor Rust (via `anchor-client`) aciona o Smart Contract assinando a transação com a Master Wallet (bancando o _gas fee_).
- **3.3. Transação Imutável On-Chain (Smart Contract):** A função `register_bet` no Anchor salva a combinação de números apostados, o ID do sorteio e o `pix_transaction_id` como prova de auditoria no ledger da Solana.

## 4. Módulo de Sorteio Autônomo e Premiação

**Objetivo:** Executar o sorteio de forma 100% automatizada, segura e com uma experiência visual que demonstre a transparência do processo (Teatro da Transparência).

- **4.1. Agendador (Cloud Scheduler):** O sorteio é disparado automaticamente através do Google Cloud Scheduler (configurado via Painel Admin), que atua como um "despertador" chamando um endpoint interno seguro (`POST /api/internal/trigger-drawing`).
- **4.2. Endpoint Secreto & OIDC:** O endpoint de gatilho do sorteio valida tokens OIDC para garantir que apenas o Cloud Scheduler possa iniciar o processo, prevenindo manipulações.
- **4.3. Fluxo de Execução do Sorteio:** Quando engatilhado:
  1. Encerra apostas do concurso atual.
  2. Solicita números via Smart Contract utilizando o Oráculo (Chainlink VRF).
  3. Aguarda resposta da aleatoriedade justa e auditável.
  4. Apura os ganhadores cruzando os números sorteados com as apostas (`Bet`).
  5. Inicia pagamentos automáticos aos vencedores (via PIX).
  6. Abre o próximo concurso para novas apostas.
- **4.4. O Teatro da Transparência (Frontend):** 
  - **Countdown:** Contagem regressiva ao vivo na página inicial, exibindo prêmio acumulado e total de apostas em tempo real.
  - **Página de Sorteio Ao Vivo:** Transformação do processo de backend em um evento visual:
    - *Passo 1:* "Solicitando números..." com link para a transação na Solana.
    - *Passo 2:* "Aguardando Oráculo..."
    - *Passo 3:* Revelação dinâmica dos números sorteados.
    - *Passo 4:* Apuração e exibição final dos ganhadores.
- **4.5. A Trilogia da Confiança:** O arquivo de resultados anteriores apresenta para cada sorteio:
  1. *Prova Criptográfica:* Link de verificação do Chainlink VRF.
  2. *Transação de Execução:* Link para explorar a transação de sorteio no Solscan.
  3. *Auditoria do Contrato:* Link direto para o Smart Contract no Solscan.

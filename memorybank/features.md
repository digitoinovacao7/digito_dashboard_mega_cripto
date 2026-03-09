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

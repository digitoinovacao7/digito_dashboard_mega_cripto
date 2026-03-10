# Product Context

## Purpose
Criar um ecossistema de loteria Web3 auditável onde os usuários podem apostar de forma transparente, sem precisar lidar manualmente com criptomoedas, seed phrases ou taxas de gas. As interações de pagamento utilizam o PIX para viabilizar o fluxo simplificado.

## Core Workflows (Fluxo de Entrada e Aposta)

1. **Onboarding (User Registration)**:
   - **Login Social (OAuth)**: Autenticação via Google usando Web3Auth ou Privy.
   - **Geração de Wallet Oculta**: O sistema gera uma carteira na rede Solana invisível para o usuário, mas publicamente vinculada ao seu login.
   - **Armazenamento Seguro de Dados de Pagamento**: Após o primeiro login, o usuário informa seus dados para recebimento de prêmios (Nome Completo, CPF/CNPJ, Chave PIX). Esses dados são enviados para o backend e armazenados em um documento seguro na coleção `users` do Google Cloud Firestore. A blockchain armazena apenas a `publicKey` do usuário, garantindo total privacidade. O objeto `paymentProfile`, contendo os dados sensíveis, só é acessível pelo servidor. Em caso de premiação, o backend utiliza a `publicKey` do vencedor para consultar seu `paymentProfile` e realizar a transferência PIX de forma segura e automatizada.

2. **Betting Mechanics (Módulo de Aposta)**:
   - **Escolha dos Números**: Frontend provê um volante digital interativo (1-25). O usuário seleciona a quantidade de números que deseja apostar (ex: 15, 16, etc).
   - **Checkout**: Ao confirmar a aposta, o backend calcula o preço (com base nos valores configurados pelo admin) e gera um pagamento dinâmico cobrando o valor da aposta usando a API do Mercado Pago.
   
3. **Webhook & On-Chain Registration (Confirmação)**:
   - **Aprovação**: O Mercado Pago avisa o Backend via Webhook que o pagamento foi liquidado.
   - **Registro Imutável**: O Servidor Web paga as taxas e assina a transação na Blockchain Solana, gravando permanentemente: os números apostados, o ID do sorteio e o ID da transação PIX.
   - **Notificação**: O frontend muda o estado para "Confirmado" e exibe o link da aposta na blockchain.

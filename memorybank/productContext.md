# Product Context

## Purpose
Criar um ecossistema de loteria Web3 auditável onde os usuários podem apostar de forma transparente, sem precisar lidar manualmente com criptomoedas, seed phrases ou taxas de gas. As interações de pagamento utilizam o PIX para viabilizar o fluxo simplificado.

## Core Workflows (Fluxo de Entrada e Aposta)

1. **Onboarding (User Registration)**:
   - **Login Social (OAuth)**: Autenticação via Google usando Web3Auth ou Privy.
   - **Geração de Wallet Oculta**: O sistema gera uma carteira na rede Solana invisível para o usuário, mas publicamente vinculada ao seu login.
   - **Cadastro de Pix**: O usuário cadastra sua chave PIX com nome, cpf/telefone, e ela é associada ao seu Pubkey no backend ou Smart Contract para o recebimento de prêmios.

2. **Betting Mechanics (Módulo de Aposta)**:
   - **Escolha dos Números**: Frontend provê um volante digital interativo (1-25). O usuário seleciona 15 números.
   - **Checkout**: Ao confirmar a aposta, o backend gera um pagamento dinâmico cobrando o valor do bilhete usando a API do Mercado Pago.
   
3. **Webhook & On-Chain Registration (Confirmação)**:
   - **Aprovação**: O Mercado Pago avisa o Backend via Webhook que o pagamento foi liquidado.
   - **Registro Imutável**: O Servidor Web paga as taxas e assina a transação na Blockchain Solana, gravando permanentemente: os 15 números, o ID do sorteio e o ID da transação PIX.
   - **Notificação**: O frontend muda o estado para "Confirmado" e exibe o link da aposta na blockchain.

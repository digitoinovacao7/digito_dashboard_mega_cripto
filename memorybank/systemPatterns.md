# System Patterns

## Architecture Overview
- **Apresentação (Frontend)**: React / React Native. Responsável pelo componente do "volante" e feedback de status do Pix.
- **Camada de Serviço (Backend REST/Webhook)**: Rust / Axum. Responsável por gerar os pagamentos no Mercado Pago, validar fluxos de dados, manter segredos, e assinar a transação que invoca a blockchain.
- **Camada de Registro (Smart Contracts)**: Rust / Anchor na Blockchain da Solana. Responsável por validar se os bilhetes vêm do servidor aprovado, e gravar no ledger de forma imutável a estrutura de aposta.

## Design Decisions
- **UX Gasless**: Usuários não pagam ou controlam gas. Uma "Master Wallet" controlada pelo Backend Rust (admin) banca o custo transacional. Para evitar abusos, o Anchor Contract tem validação de Signer exigindo a assinatura dessa carteira administrativa.
- **Auditoria On-chain via Payment ID**: Para evitar fraude de dados off-chain x on-chain, o recibo PIX do Mercado Pago (`pix_transaction_id`) é armazenado na aposta dentro do Smart Contract.
- **Assincronia no Frontend**: Como a liquidação do Pix e a gravação na blockchain têm latências distintas (alguns segundos), o client adota o padrão de WebSocket ou Long Polling (a implementar) para "esperar" o backend avisar sobre o status do webhook.

## File Structure Patterns
- `programs/*/src/` -> Contém exclusivamente o contrato inteligente da blockchain escrito usando o framework Anchor.
- `backend/` -> Serviço em Node/Rust avulso ao contrato, responsável por lidar com o mundo "web2".
- `app/` ou `/` -> Código do WebApp React de interação com os usuários.

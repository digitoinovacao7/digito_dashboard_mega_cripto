# System Patterns

## Architecture Overview
- **Apresentação (Frontend)**: React / React Native. Responsável pelo componente do "volante", feedback de status do Pix e pelo "Teatro da Transparência" (sorteios ao vivo).
- **Camada de Serviço (Backend REST/Webhook)**: Rust / Axum. Responsável por gerar os pagamentos no Mercado Pago, validar fluxos de dados, manter segredos, processar a loteria de forma autônoma (via endpoint protegido com OIDC) e assinar transações na blockchain.
- **Automação de Tarefas (Cloud Scheduler)**: Google Cloud Scheduler atua como o motor de cronograma, engatilhando rigidamente a chamada segura para iniciar o sorteio no backend.
- **Camada de Registro e Oráculo (Smart Contracts)**: Rust / Anchor na Blockchain da Solana com integração ao Oráculo (ex: Chainlink VRF). Responsável por validar a origem dos bilhetes, gravar apostas imutavelmente e prover números aleatórios matematicamente provados.

## Design Decisions
- **UX Gasless**: Usuários não pagam ou controlam gas. Uma "Master Wallet" controlada pelo Backend Rust (admin) banca o custo transacional. Para evitar abusos, o Anchor Contract tem validação de Signer exigindo a assinatura dessa carteira administrativa.
- **Auditoria On-chain via Payment ID**: Para evitar fraude de dados off-chain x on-chain, o recibo PIX do Mercado Pago (`pix_transaction_id`) é armazenado na aposta dentro do Smart Contract.
- **Assincronia no Frontend**: Como a liquidação do Pix e a gravação na blockchain têm latências distintas (alguns segundos), o client adota o padrão de WebSocket ou Long Polling (a implementar) para "esperar" o backend avisar sobre o status do webhook.

## File Structure Patterns
- `programs/*/src/` -> Contém exclusivamente o contrato inteligente da blockchain escrito usando o framework Anchor.
- `backend/` -> Serviço em Node/Rust avulso ao contrato, responsável por lidar com o mundo "web2".
- `app/` ou `/` -> Código do WebApp React de interação com os usuários.

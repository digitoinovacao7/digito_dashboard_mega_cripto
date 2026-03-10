# Progress

## Funcionalidades Concluídas
- [x] Criação do repositório base com Anchor
- [x] Estrutura do Smart Contract: Accounts `UserAccount` e `Bet` para gerenciar apostas e PIX IDs.
- [x] Lógica `register_bet` no Blockchain (Validação Signature do Server).
- [x] Setup do Backend em Axum (Cargo.toml e main.rs router estruturado).
- [x] Construção e roteamento da WebApp UI em React (Volante 15-20 números dinâmico, Login, Regras e AdminDash).
- [x] Limpeza de Mocks no Frontend e conexão do Dashboard Admin/User diretamente na API local.
- [x] Estrutura de persistência State/Mutex no lado do Rust pra salvar dados temporariamente limitados por `payment_id`.

## Em Andamento / Para serem Executados
- [ ] Conectar API Real do Mercado Pago no endpoint de criação de PIX e Webhook.
- [ ] Função final de conexão RPC `anchor-client` disparando envio real da transação Solana do lado do Servidor.
- [ ] Implementação Real-time (Websockets / Polling) para avisar a GameInterface que o Webhook do PIX compensou e emitir confetes "Aposta Confirmada".
- [ ] Testes de Contratos do Solana (Pasta `tests/`).

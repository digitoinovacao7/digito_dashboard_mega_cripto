# Progress

## Funcionalidades Concluídas
- [x] Criação do repositório base com Anchor
- [x] Estrutura do Smart Contract: Account \`UserAccount\` para rastrear as IDs Pix
- [x] Estrutura do Smart Contract: Account \`Bet\` para vincular usuário, números, sorteio e transaction PIX ID.
- [x] Estrutura do Smart Contract: Account `UserAccount` para rastrear as IDs Pix
- [x] Estrutura do Smart Contract: Account `Bet` para vincular usuário, números, sorteio e transaction PIX ID.
- [x] Lógica `register_bet` no Blockchain (Validação Signature do Server).
- [x] Setup do Backend em Axum (Cargo.toml e main.rs router estruturado).
- [x] Handler para receber resposta assíncrona do Webhook Mercado Pago.
- [x] Criação do Memory Bank de documentação da arquitetura do projeto.

## Em Andamento / Para serem Executados
- [x] Endpoint de Criação de Pedido na API do Mercado Pago (`/create-payment`).
- [x] Construção e roteamento da WebApp UI em React (Volante, Login, Admin e Checkout).
- [ ] Conectar frontend axios calls the `startBet` button.
- [ ] Estrutura de persistência Cache/Redis do lado do Rust pra salvar os "15 números" enquanto o webhook não chega limitados por `payment_id`.
- [ ] Função final de conexão RPC `anchor-client` disparando envio real do Anchor Smart Contract do lado Servidor Node Web.
- [ ] Testes de Contratos do Solana (Pasta `tests/`).

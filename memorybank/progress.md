# Progress — Mega Cripto
> Última atualização: 10/03/2026 às 21:28 | Backend: `cargo check` ✅ | Frontend: `tsc --noEmit` ✅

---

## ✅ Funcionalidades 100% Concluídas

### Infraestrutura Base
- [x] Repositório base criado com Anchor (Smart Contract Solana)
- [x] Smart Contract: Accounts `UserAccount` e `Bet` para apostas e PIX IDs
- [x] Lógica `register_bet` no Blockchain com validação de assinatura do server (server_authority)
- [x] Backend Rust (Axum) com `Cargo.toml` e router completo
- [x] Frontend React/TypeScript com Vite e TailwindCSS
- [x] Autenticação via Firebase/Google OAuth (useAuth hook)
- [x] Persistência em memória via `AppState` com `Arc<Mutex<>>` (Rust)

### Módulo de Apostas
- [x] Volante digital funcional: 15 a 20 números de 25 disponíveis
- [x] Cálculo dinâmico de preço em tempo real por quantidade de números
- [x] Surpresinha (seleção aleatória automática)
- [x] Múltiplos jogos no carrinho com remoção individual
- [x] Integração real com **Mercado Pago** — geração de QR Code PIX real via `POST /v1/payments`
- [x] Webhook do Mercado Pago verificada via `GET /v1/payments/:id` antes de processar
- [x] Registro On-Chain real via instrução Anchor manual com discriminator correto + `RpcClient::send_and_confirm_transaction`
- [x] Link clicável da **Solana Explorer** para cada aposta confirmada
- [x] Bloqueio visual e funcional do checkout quando apostas estão encerradas

### Modal de Chave PIX (NOVO)
- [x] Modal elegante abre no primeiro checkout sem chave PIX cadastrada
- [x] Tipos: CPF, e-mail, telefone, chave aleatória
- [x] Endpoint `POST /user/register-pix` salva chave PIX real por usuário
- [x] Payout automático usa chave PIX real cadastrada (fallback: email)
- [x] `localStorage` guarda a chave PIX para não pedir toda vez

### Polling de Confirmação (NOVO)
- [x] Endpoint `GET /payment/status/:tx_id` detecta confirmação do pagamento
- [x] Frontend faz polling a cada 3s após exibição do QR Code
- [x] Modal animado "Aposta Confirmada! 🎉" com link da Solana Explorer ao confirmar

### Timer Real + Encerramento (NOVO)
- [x] Endpoint `GET /draw/status` retorna `betsOpen`, `nextDrawAt` (ISO 8601) e `msUntilDraw`
- [x] `POST /admin/set-next-draw` — admin agenda data/hora do próximo sorteio
- [x] `POST /admin/toggle-bets` — admin abre/fecha apostas manualmente
- [x] Auto-encerramento: quando `nextDrawAt` chegou a zero, `bets_open` vira `false` automaticamente
- [x] Timer no frontend sincroniza com servidor a cada 30s (anti-drift) + decremento local a cada 1s
- [x] Volante e botão de checkout ficam desabilitados quando apostas encerradas

### Módulo de Sorteio / Apuração
- [x] Endpoint `POST /admin/trigger-draw` executa o sorteio completo
- [x] Apuração automática de ganhadores por faixa: **15 acertos (60%), 14 acertos (25%), 13 acertos (15%)**
- [x] Cálculo de `prize_per_winner = pool / nº_de_ganhadores` por faixa
- [x] Lógica de **Jackpot/Rollover**: sem ganhador → valor acumula para próximo concurso
- [x] Tickets marcados como "Premiado" / "Não Premiado" após apuração
- [x] `prize_amount_brl` preenchido em cada ticket premiado
- [x] Resultado com `tiers` de ganhadores por faixa na API `/results`
- [x] Novo concurso iniciado automaticamente após sorteio

### Payout Automático (NOVO)
- [x] `pay_winner_via_pix` chama `POST /v1/account/bank_transfers` do Mercado Pago
- [x] Execução em background via `tokio::spawn` (não bloqueia resposta do sorteio)
- [x] Idempotency-key por ganhador + sorteio (evita pagamento duplicado)

### Painel Administrativo
- [x] Dashboard com stats em tempo real (volumeBRL, totalTickets, gasPoolSOL)
- [x] Acionamento manual de sorteio
- [x] Configuração de preços de apostas via `GET/POST /admin/config`
- [x] Visualização de resultados anteriores com tiers

### Páginas do Frontend
- [x] **HomePage**: Timer real da API, prêmio estimado dinâmico, crypto ticker
- [x] **GameInterface**: Volante completo + checkout + PIX key modal + polling de confirmação
- [x] **MyBetsPage**: Lista de apostas com status, link Solana Explorer, valor do prêmio
- [x] **RulesPage**: Regras completas, tabela de preços, faixas de premiação
- [x] **AdminDash**: Painel admin com múltiplas tabs
- [x] **Home page**: Sem dados mockados (renderização condicional)

---

## 🟡 Em Andamento / Parcialmente Implementado

- [ ] **Cadastro de chave PIX no onboarding** — modal existe no GameInterface, mas falta fluxo dedicado no perfil do usuário após o login
- [ ] **Notificação proativa (push/websocket)** — polling funciona, mas sem push notification assíncrona ao usuário quando longe do app
- [ ] **Chainlink VRF** — sorteio usa `rand::thread_rng()` local em vez do oráculo (suficiente para V1, necessário para produção)
- [ ] **Agendador automático (Cloud Scheduler)** — sorteio ainda requer clique manual do admin; falta configurar cron/GCP

---

## ❌ Não Implementado (Pós-V1)

- [ ] **Testes on-chain do Solana** — pasta `tests/` com anchor test (mocha/chai)
- [ ] **OIDC no trigger-draw** — validação de token Cloud Scheduler no endpoint do sorteio
- [ ] **Dead-letter queue** — fila de retry para payouts e transações on-chain falhas
- [ ] **Banco de dados persistente** — PostgreSQL/Redis (hoje tudo está em memória, resetado ao reiniciar o servidor)
- [ ] **Página de Sorteio Ao Vivo** — `LiveDraw` com revelação animada dos números passo a passo

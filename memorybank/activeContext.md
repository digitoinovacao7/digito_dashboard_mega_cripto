# Active Context

## Foco Atual
Estruturação e finalização da espinha dorsal "Core": integração do **Smart Contract (Anchor)** e o **Servidor de Webhook e Endpoints Web (Rust + Axum)**.

## Últimas Modificações
- O Smart Contract `digito_dashboard_mega_cripto` foi refatorado para conter as entidades `UserAccount` e `Bet`.
- O Contract agora expõe a instrução `register_bet` com validação de assinatura `server_authority`.
- Backend (`axum` e `reqwest` + `uuid`) estruturado. Endpoint mockado `POST /create-payment` rodando com CORS configurado.
- Estruturação do Monorepo (/frontend e /backend e /programs).
- Scaffold do Frontend React com Vite, Tailwind v4 e React Router DOM finalizado.
- Criação dos mocks de UX (Home, Volante, UserDash, AdminDash) e AuthGuard protegendo rotas não-logadas. Botão de Admin movido pro Footer aparecendo apenas para super usuários identificados pela flag `isAdmin`.

## Próximos Passos Imediatos
1. Inserir lógica dentro do componente frontend `GameInterface.tsx` atrelando o botão de Checkout à API do Axios (`startBet()`).
2. Criar a tela simulada de aguardar pagamento com o QR Code recebido no Frontend.
3. Substituir lógica mock do contrato Anchor no webhook do backend (`process_bet_on_chain`) pela integração real com a rede Solana via `anchor-client`.

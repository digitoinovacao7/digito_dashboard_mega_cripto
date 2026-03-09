# Active Context

## Foco Atual
Estruturação e finalização da espinha dorsal "Core": integração do **Smart Contract (Anchor)** e o **Servidor de Webhook e Endpoints Web (Rust + Axum)**.

## Últimas Modificações
- Escopo do Smart Contract reforçado (`UserAccount` e `Bet`). Segurança implementada em `register_bet` com assinatura de master wallet (Backend Server).
- Backend (Axum + reqwest + uuid) rodando com endpoint inicial `POST /create-payment` provendo Mocks de PIX com CORS habilitado.
- Frontend base arquitetado com React Vite e Tailwind v4, rotas em React Router DOM.
- AuthGuard (Web3Auth login mock) controlando acesso e gerando contexto de variável global via React Context APIs.
- Concluída a implementação da `GameInterface.tsx` - O UI de Checkout agora se comunica via Axios com o BackEnd, entra em visual de Status de Carregamento, exibe o QR Code Pix provido pelo BackEnd e possui link de "copiar" no Clipboard.
- Camada de Segurança tripla implantada no `AdminDash.tsx` com renderização condicional rígida na qual visitantes deslogados recusam a página inteira, usuários comuns recebem escudo de bloqueio vermelho, e as contas na "Whitelist de Admins" vêem os dados vitais multi-sig sensíveis.

## Próximos Passos Imediatos
1. Configurar lógica de Redis ou `AppState` (in-memory lock temporário no Backend em Rust) para memorizar a "Aposta/Números" enquanto aguradamos o Webhook de pagamento.
2. Substituir lógica mock do contrato Anchor no webhook do backend (`process_bet_on_chain`) pela submissão real com a rede Solana usando o package `anchor-client`.
3. Iniciar a estruturação do script de extração Firebase para hospedar a interface web ou interligação autônoma do Front com o Back.

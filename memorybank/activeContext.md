# Active Context

## Foco Atual
Estruturação e finalização da espinha dorsal "Core": integração do **Smart Contract (Anchor)** e o **Servidor de Webhook e Endpoints Web (Rust + Axum)**.

## Últimas Modificações
- O Smart Contract \`digito_dashboard_mega_cripto\` foi refatorado para conter as entidades \`UserAccount\` e \`Bet\`.
- O Contract agora expõe a instrução \`register_bet\` que impõe auditoria validando se a carteira Master Authority (\`server_authority\`) consta na lista de dependências e efetivamente assinou a instrução.
- Inicialização do projeto base \`backend\` (do lado Axum).
- Estruturação do fluxo em \`mercado_pago_webhook\`, parseando JSON e encaminhando para processo on-chain que utiliza as credenciais do servidor.

## Próximos Passos Imediatos
1. Desenvolver Endpoint \`POST /create-bet\` que interaja com o Mercado Pago para gerar a cobrança (código BRCODE do PIX).
2. Substituir lógica mock do contrato Anchor no webhook do backend (\`process_bet_on_chain\`) pela integração real usando a \`anchor-client\`.
3. Escrever código Unit Tests em TypeScript ou Rust na pasta \`tests/\` (Anchor tests) para bater na lógica de apostas da blockchain num ambiente localhost (\`solana-test-validator\`).

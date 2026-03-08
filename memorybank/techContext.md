# Tech Context

## Technology Stack

- **Linguagens e Frameworks Prévios**: Rust (Contratos e Backend), TypeScript (Web Frontend).
- **Frontend App**: React.js / Next.js com TailwindCSS para construção de UI atrativa.
- **Auth Provider**: Web3Auth (Login Social + Gerenciamento seguro da chave privada do lado do cliente).
- **Backend App**: \`axum\` para lidar com dezenas de milhares de endpoints concorrentes.
- **Smart Contract Framework**: Anchor CLI (simplifica desenvolvimento na Solana com mapeamento fácil de Contas/Instruções).
- **Integração com Solana**:
  - \`solana-sdk\`, \`anchor-client\` do lado do back-end para formatar e disparar as chamadas \`RPC\`.

## Serviços Externos (APIs)
- **Mercado Pago Webhooks API**: Fornece os eventos \`payment.created\` e \`payment.updated\` atrelados à conta do merchant.
- **Solana Devnet / Mainnet-Beta RPC**: Rota de acesso via Helius, QuickNode ou Alchemy para publicar transações e consultar blocos.

## Convenções de Código e Banco de Danos
- Rust Backend: Padronização utilizando \`Arc<>Mutex<>\` pra estado compartilhado nas rotas Axum (se não houver banco temporário).
- Recomenda-se utilizar Redis ou PostgreSQL no Backend Rust pra transacionar o "ID do PIX -> Numeros do Cliente", pois eles necessitam aguardar em memória até a aprovação do webhook.

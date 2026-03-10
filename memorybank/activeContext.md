# Active Context

## Foco Atual
Finalização da ponte de integração entre o Frontend React e o Backend Rust (Endpoints de Status, Pagamento e Webhooks).

## Últimas Modificações
- Regras de negócio de Apostas Múltiplas (15 a 20 números) implementadas na `GameInterface.tsx` com Dropdown de seleção dinâmico e cálculo de probabilidade e preço (R$ 3,50 até R$ 54.264,00).
- Backend (Axum) aprimorado com estado em memória (`AppState`) para simular armazenamento do banco de dados enquanto gerencia a contabilidade de conexões concorrentes.
- Criação dos endpoints reais `GET /admin/stats` e `GET /user/stats` no Rust, devolvendo dados dinâmicos do `AppState` gerenciado pelo Mutex.
- Frontend limpo de códigos falsos (Mocks): O Painel Administrativo agora reflete apenas transações reais processadas e conectadas pelo Backend (Axios), e configurações inúteis (como edição de percentual de prêmio) foram removidas para garantir auditoria Web3.
- Remoção de links redundantes como "Meu Painel" no Header, unificando a navegação em "Minhas Apostas".

## Próximos Passos Imediatos
1. Configurar credenciais reais da API do Mercado Pago no Rust para que a função `/create-payment` gere um objeto real com um QR Code Pix escaneável pelo aplicativo do banco.
2. Substituir lógica mock do contrato Anchor no webhook do backend (`process_bet_on_chain`) pela submissão e assinatura real na rede Solana usando o package `anchor-client` e uma IDL válida.
3. Iniciar a estrutura de testes de integração ponta a ponta (E2E), criando uma aposta no Frontend, efetuando o pagamento e escutando a mudança de tela via WebSockets ou Polling.

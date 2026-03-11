# Active Context

## Foco Atual
Finalização da primeira versão estável (V1) da Loteria Web3 focada em funcionalidades críiticas de retenção, automatização de sorteio, UX e infraestrutura on-chain.

## Últimas Modificações (Sessão Atual)
- **Temporizador Real e Encerramento de Segurança:** Construção e integração do endpoint `GET /draw/status` no `HomePage.tsx` e `GameInterface.tsx`. Agora a plataforma reconhece o encerramento do sorteio, bloqueando visualmente e funcionalmente (no backend) o recebimento de novas intenções de aposta se o relógio zerar. Admin pode definir a data/hora via `POST /admin/set-next-draw`.
- **Registro Real de Chave PIX:** Ao invés de usar o e-mail obrigatoriamente, a plataforma requer do usuário no primeiro checkout a criação de uma `PIX Key`, armazenando a mesma via `POST /user/register-pix`. O Payout automático cruza os ganhadores e os envia o dinheiro pela sua respectiva chave via API real do Mercado Pago (`/v1/account/bank_transfers`).
- **Verificação via Polling de Sucesso de PIX:** Implementado mecanismo de escuta no Front-End (`GameInterface.tsx` via `setInterval` no endpoint `GET /payment/status/:tx_id`) garantindo que assim que o webhook receber o status `approved` do Mercado Pago e executar a transação na blockchain (`register_bet`), a tela atualiza com sucesso emitindo link direto da Solana Explorer.
- **Transação On-chain Pura:** Refatorado erro de versionamento pesado do `anchor-client` movendo a assinatura da instrução de smart-contract para serialização via `borsh` nativa da instrução Anchor `RpcClient::send_and_confirm_transaction(tx)`.

## Próximos Passos Imediatos (Pós V1 / Próxima Sessão)
1. **Agendador (Cloud Scheduler):** Configurar gatilho externo repetitivo no GCP ou AWS para chamar `POST /admin/trigger-draw` nos dias/horários estipulados de sorteio sem depender do botão físico de Admin.
2. **Implementar "Jogo Responsável" (KYC e Autoexclusão):** Criar fluxos de travamento de transações ou desativação de Login para auxiliar na obtenção da licença SPA e conformidade no Brasil (como documentado em `checkListDoc.md`).
3. **Chainlink VRF (Sorteio Auditável Real):** Substituir módulo RNG nativo `rand::thread_rng()` do Rust no encerramento pelo consumo atestado e verificável de Oráculos (Chainlink) gravando a semente resultante no banco.

# Active Context

## Foco Atual
Finalização da primeira versão estável (V1) da Loteria Web3 focada em funcionalidades críiticas de retenção, automatização de sorteio, UX e infraestrutura on-chain.

## Últimas Modificações (Sessão Atual)
- **Central de Suporte Firebase:** Criada a `SupportPage.tsx` com formulário integrado ao Firestore (coleção `support_tickets`). Inclui feedback visual de carregamento e notificações de sucesso via `react-hot-toast`.
- **Gestão de Suporte no Admin:** Adicionada aba "Suporte" no `AdminDash.tsx` com o componente `SupportTicketManagement.tsx`. Gerenciamento em tempo real de tickets (status Aberto/Resolvido e exclusão).
- **Isenção de KYC para Administradores:** Refatorado `ProtectedRoute.tsx` e `VerificarIdadePage.tsx` para permitir que administradores ignorem o processo de verificação de perfil, garantindo acesso direto às ferramentas de gestão.
- **Organização do Memory Bank:** Reestruturação da documentação em pastas (`business`, `architecture`, `status`, `infrastructure`) para melhor manutenção do projeto.
- **Aprimoramento do Script de Deploy:** Atualizado `deploy.sh` para utilizar Google Cloud Build, eliminando a dependência do Docker local no ambiente do usuário.

## Próximos Passos Imediatos
1. **Faturamento no GCP:** O usuário precisa vincular uma conta de faturamento ao projeto `megasorteuai` para habilitar Cloud Build e Cloud Run.
2. **Agendador (Cloud Scheduler):** Configurar gatilho externo repetitivo para automatizar o sorteio (trigger-draw).
3. **Chainlink VRF:** Implementar sorteio auditável real via oráculos.

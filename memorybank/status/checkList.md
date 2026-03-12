# 📋 Master Checklist - Mega Cripto V1

Documento de acompanhamento para o lançamento da primeira versão estável. Organizado por prontidão e módulos funcionais.

---

## 🟢 1. FUNCIONALIDADES PRONTAS (Ready for Production)

### 🎲 Núcleo de Apostas & Blockchain
- [x] **Volante Inteligente**: Seleção de 15-20 números com cálculo de preço dinâmico.
- [x] **Integração Solana**: Registro on-chain de apostas via `devnet` com assinatura do servidor.
- [x] **Minhas Apostas**: Visualização histórica e status de bilhetes por usuário.
- [x] **Links de Transparência**: Acesso direto ao Solana Explorer para conferência de apostas e sorteios.

### 💸 Pagamentos & Payouts (Mercado Pago)
- [x] **Checkout PIX**: Geração de QR Code e Copia e Cola para apostas.
- [x] **Webhook de Confirmação**: Processamento automático de aprovação e emissão de bilhete.
- [x] **Cadastro de Chave PIX**: Fluxo de onboarding para recebimento de prêmios.
- [x] **Payout Automático**: Envio de prêmios via PIX direto para os ganhadores após o sorteio.

### 🛠️ Gestão & Suporte (Admin)
- [x] **Dashboard Administrativo**: Visão geral de volume, usuários e status do pool.
- [x] **Central de Suporte**: Formulário de contato para usuários e painel de gestão para admin.
- [x] **Segurança Admin**: Bypass de KYC (Verificação de Perfil) para contas administrativas.
- [x] **Controle de Concursos**: Abertura, fechamento e agendamento de sorteios via painel.

### ⚖️ Conformidade & Legal (Brasil)
- [x] **Políticas Obrigatórias**: Termos de Uso, Privacidade e Jogo Responsável implementados.
- [x] **Proteção de Dados (LGPD)**: Banner de consentimento de cookies e tratamento de dados sensíveis.
- [x] **Travas de Jogo Responsável**: Bloqueio de apostas para usuários em autoexclusão no Backend.

---

## 🟡 2. EM DESENVOLVIMENTO / AJUSTES (Work in Progress)

### 🕒 Automatização
- [ ] **Cloud Scheduler**: Configurar gatilho externo para o `trigger-draw` (atualmente o admin clica no botão).
- [ ] **Notificações**: Alertas de vitória/pagamento via E-mail ou WebSocket.

---

## 🔴 3. ROADMAP V2 (Futuro / Mainnet)

### 🔐 Segurança Avançada & Auditoria
- [ ] **Chainlink VRF**: Implementar sorteio auditável 100% via oráculo externo (substituindo o RNG atual).
- [ ] **Auditoria Legal**: Submissão formal para obtenção da licença SPA.
- [ ] **Migração Mainnet**: Transição da Solana Devnet para a rede principal.

---

## 📈 Resumo de Progresso
| Categoria | Progresso | Status |
| :--- | :--- | :--- |
| Core Backend | 95% | 🟢 Estável |
| Frontend UX | 100% | 🟢 Concluído |
| Admin / Suporte | 100% | 🟢 Concluído |
| Conformidade | 100% | 🟢 Concluído |
| Automação | 70% | 🟡 Em Testes |
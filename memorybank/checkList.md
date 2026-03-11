# Checklist Oficial de Lançamento da V1 - "Mega Cripto"

Este é o documento unificado que contempla tanto as regras de negócio do sistema (Smart Contracts, Frontend e Backend) quanto os requisitos fundamentais de conformidade regulatória (LGPD e Secretaria de Prêmios e Apostas - SPA) para atuar legalmente.

---

## 🎯 1. Núcleo da Aposta (O Coração da Plataforma)
- [x] **Instância de Concurso**: O painel de administrador permite criar um novo concurso (Ex: Concurso nº 1), que se torna o concurso "ativo".
- [x] **Volante Digital Funcional**: O usuário pode selecionar de 15 a 20 números no volante de 25.
- [x] **Cálculo Dinâmico de Preço**: A interface mostra o preço da aposta em tempo real, mudando conforme o usuário seleciona mais de 15 números.
- [x] **Fluxo de Pagamento com PIX e PIX Key**: O ciclo Cadastrar Chave -> Apostar -> PIX QR Code -> Pagamento -> Polling Confirmação ocorre integralmente via Mercado Pago (Real).
- [x] **Registro On-Chain Real**: O webhook converte processamentos aprovados em instruções transacionadas via `solana-sdk` diretamente em uma localnet / devnet. 
- [x] **"Minhas Apostas"**: A área do usuário logado exibe corretamente suas apostas para o concurso atual.

## 🗓️ 2. O Sorteio (O Momento da Verdade)
- [x] **Contador Regressivo**: A página inicial e a Game Area exibem o timer sincronizado pela server-API para o próximo sorteio.
- [x] **Encerramento Automático das Apostas**: No horário programado, a API proíbe checagens PIX no backend e na View a roleta é bloqueada com "Apostas Encerradas".
- [ ] **Execução Automática do Sorteio**: Agendador (Cloud Scheduler) dispara o processo (atualmente é clicado manualmente em tela Admin).
- [ ] **Prova de Aleatoriedade (Chainlink VRF)**: O sorteio usa oráculo Chainlink VRF (atualmente é feito Randomically via Servidor).
- [x] **Página de Resultados (API)**: Com a apuração sendo gerada o sistema separa e salva as cotas para o "DrawStats".
- [ ] **Links de Transparência**: A página de resultados exibe todos os vínculos Web3 de forma clara (Transação / Oráculo).

## 💰 3. Premiação e Pagamentos (A Recompensa)
- [x] **Apuração Automática**: O sistema identifica 15, 14, e 13 acertos separando em "tiers".
- [x] **Cálculo de Distribuição de Prêmios**: Valores repartidos automaticamente (`total_tickets * bet_price * 0.6` etc.).
- [x] **Lógica de Acumulação/Jackpot**: Ocorrendo casos de sorteio sem ganhadores na 1ª faixa, o valor rola p/ o próximo sorteio.
- [x] **Pagamento Automático via PIX M.P.**: Trigger da API transfere o prêmio à chave PIX cadastrada dinamicamente (payout real automático).
- [ ] **Notificação ao Ganhador**: E-mails SMTP ou push websockets em telas ativas informando do recebimento.

## 👤 4. Administração e Experiência do Usuário
- [x] **Painel de Administrador Seguro**: Operações e stats escondidas sob restrições para contas Admin.
- [x] **Agendamento de Sorteios**: O admin define em modal o Target ms timestamp preenchendo o `next_draw_at`.
- [x] **Onboarding Simples c/ Modal PIX**: Login OAuth Google -> Solicita Chave PIX.
- [x] **Responsividade**: Site funciona bem tanto em desktop quanto mobile.

## ⚖️ 5. Conformidade Legal e Regulatória (LGPD e SPA/Brasil)
- [x] **Termos de Uso e Condições Gerais**: Criada a página estática `/termos` detalhando regras, restrições e explicando explicitamente a mecânica cripto amarrada a valores fiduciários em BRL/PIX.
- [x] **Política de Privacidade (LGPD)**: Criada a página estática `/privacidade` listando uso de dados sensíveis (Chave Pix, CPF) e direitos do usuário.
- [x] **Banner de Consentimento de Cookies**: O frontend agora conta com pop-up universal exigindo aceite com save point em `localStorage`.
- [x] **Política de Jogo Responsável (Textos)**: Página `/jogo-responsavel` com alertas, orientações sobre limites de risco, links de ajuda e a necessidade e proibição estrita a menores de idade.
- [x] **Ferramentas de Jogo Responsável (Frontend na Prática)**: Seção de autoexclusão e limites diários de gastos R$ injetados no Painel do Usuário (`UserDash`).
- [x] **Travas do Jogo Responsável (Backend na Prática)**: A API no Rust agora barra o PIX retornando erro limpo `403 Forbidden` quando o sistema cruza um bloqueio ativo de "Conta em Auto-Exclusão" imposto pelo próprio jogador.

---

## Próximos Passos Recomendados
1. Re-integrar o Chainlink VRF como fonte entrópica antes de migrar para a Mainnet Solana.
2. Contratar equipe especializada de Advogados pra desenrolar o pedido junto ao Ministério da Fazenda.
3. Linkar um Cloud Scheduler para que a chamada `/trigger-draw` não envolva nenhuma interveniência humana da nossa empresa, garantindo 100% de automação e transparência aos apostadores.
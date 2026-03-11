Checklist de Lançamento da V1 - "Mega Cripto"

🎯 1. Núcleo da Aposta (O Coração da Plataforma)
[x] Instância de Concurso: O painel de administrador permite criar um novo concurso (Ex: Concurso nº 1), que se torna o concurso "ativo".
[x] Volante Digital Funcional: O usuário pode selecionar de 15 a 20 números no volante de 25.
[x] Cálculo Dinâmico de Preço: A interface mostra o preço da aposta em tempo real, mudando conforme o usuário seleciona mais de 15 números.
[x] Fluxo de Pagamento com PIX e PIX Key: O ciclo Cadastrar Chave -> Apostar -> PIX QR Code -> Pagamento -> Polling Confirmação ocorre integralmente via Mercado Pago (Real).
[x] Registro On-Chain Real: O webhook converte processamentos aprovados em instruções transacionadas via `solana-sdk` diretamente em uma localnet / devnet. 
[x] "Minhas Apostas": A área do usuário logado exibe corretamente suas apostas para o concurso atual.

🗓️ 2. O Sorteio (O Momento da Verdade)
[x] Contador Regressivo: A página inicial e a Game Area exibem o timer sincronizado pela server-API para o próximo sorteio.
[x] Encerramento Automático das Apostas: No horário programado, a API proíbe checagens PIX no backend e na View a roleta é bloqueada com "Apostas Encerradas".
[ ] Execução Automática do Sorteio: Agendador (Cloud Scheduler) dispara o processo (atualmente é clicado manualmente em tela Admin).
[ ] Prova de Aleatoriedade (Chainlink VRF): O sorteio usa oráculo Chainlink VRF (atualmente é feito Randomically via Servidor).
[x] Página de Resultados (API): Com a apuração sendo gerada o sistema separa e salva as cotas para o "DrawStats".
[ ] Links de Transparência: A página de resultados exibe todos vínculos Web3.

💰 3. Premiação e Pagamentos (A Recompensa)
[x] Apuração Automática: O sistema identifica 15, 14, e 13 acertos separando em "tiers".
[x] Cálculo de Distribuição de Prêmios: Valores repartidos automaticamente (`total_tickets * bet_price * 0.6` etc.).
[x] Lógica de Acumulação: Ocorrendo casos de sem ganhadores de faixa 1 o valor rola p/ próximo `Draw`.
[x] Pagamento Automático via PIX M.P.: Trigger da API transfere saldo à chave PIX cadastrada dinamicamente do usuário pagando automaticamente os prêmios.
[ ] Notificação ao Ganhador (Pós V1): E-mails SMTP ou push websockets em telas ativas de vencedores.

👤 4. Administração e Experiência do Usuário
[x] Painel de Administrador Seguro: Operações escondidas sob restrições para carteiras Admin.
[x] Agendamento de Sorteios: O admin define em modal o Target ms timestamp `next_draw_at`.
[x] Onboarding Simples c/ Modal PIX: Login OAuth Google -> Solicita apenas Chave PIX (CPF/Email/Fone).
[x] Responsividade Básica V1.

⚖️ Regulatório (TBD - checkListDoc.md)
[ ] Tela Termos de LGPD e KYC
[ ] Autoexclusão (Definir limite de compra bloqueando chamadas do Axios Frontend).
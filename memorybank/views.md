# Telas e Componentes Essenciais por Visão de Usuário

Este documento detalha as telas e componentes essenciais para cada um dos três cenários de usuário do nosso aplicativo.

## 1. Visão do Usuário Deslogado (Visitante)
O objetivo principal aqui é atrair, informar e converter. O visitante precisa entender a proposta de valor rapidamente e se sentir seguro para se cadastrar.

### Telas e Componentes Essenciais:

**Página Inicial (Landing Page):**
- **Headline Principal:** Uma frase de impacto clara e convidativa. Ex: "A loteria transparente que paga no PIX."
- **Countdown e Stats em Tempo Real:** Um grande contador regressivo para o próximo sorteio, acompanhado do prêmio acumulado dinâmico e "Total de Apostas" atualizados ao vivo. Ao chegar a zero exibe: "APOSTAS ENCERRADAS. SORTEIO EM ANDAMENTO".
- **Botão de Ação (CTA):** Um botão grande e visível para "Entrar com Google" ou "Cadastre-se para Jogar".
- **Seção "Como Funciona":** Um resumo visual e simples em 3 ou 4 passos.
- **Resultados do Último Sorteio:** Exibir os números sorteados, o número de ganhadores por faixa e o prêmio pago.
- **Seção de Transparência:** Pequenos ícones e textos destacando "Tecnologia Solana", "Sorteio Auditável com Chainlink VRF" e "Pagamento Garantido via PIX".

**Página de Sorteio Ao Vivo (O Teatro da Transparência):**
- Página dedicada que transforma o sorteio de backend em um evento visual em tempo real.
- **Passos da Animação:** 
  1. *Solicitando Aleatoriedade:* Animação com **Link da Transação no Solscan**.
  2. *Aguardando Oráculo:* Efeito visual de processamento validando a cadeia de blocos.
  3. *Grande Revelação:* Exibição dos números um a um.
  4. *Apuração e Resultado Final:* Tabela final com todos os ganhadores por acerto.

**Página de Resultados Anteriores:**
- Um histórico de todos os sorteios passados.
- Para cada sorteio: data, números sorteados, e a **"Trilogia da Confiança"**:
  1. **Verificar Prova Criptográfica do Sorteio:** Link para validá-la no Chainlink VRF.
  2. **Verificar Transação de Sorteio na Blockchain:** Link para o Solscan da transação.
  3. **Auditar o Contrato da Loteria:** Link direto para leitura do Smart Contract.

**Página de Regras / FAQ:**
- O documento de regras que acabamos de ajustar.
- Uma seção de Perguntas Frequentes (FAQ) para tirar dúvidas sobre segurança, legalidade, e como os pagamentos funcionam.

## 2. Visão do Cliente Logado (Apostador)
O foco aqui é a ação e o gerenciamento pessoal. A experiência deve ser fluida, segura e recompensadora.

### Telas e Componentes Essenciais:

**Painel Principal (Dashboard):**
- Uma saudação personalizada ("Olá, [Nome do Usuário]!").
- **Componente de Aposta Rápida:** O volante digital já visível e pronto para o usuário escolher os números para o próximo sorteio.
- **Resumo das Apostas Ativas:** Uma pequena seção mostrando quantas apostas ele já fez para o próximo concurso e quais números jogou.
- **Histórico Recente:** Um resumo dos seus últimos resultados ("Você ganhou R$ XX no último sorteio!").

**Página de Aposta Completa:**
- O **Volante Digital Interativo** é a estrela aqui.
- À medida que o usuário seleciona os números (15, 16, etc.), a interface deve mostrar dinamicamente o preço da aposta.
- Botão "Finalizar e Pagar com PIX".
- Ao clicar, um modal de pagamento aparece com o QR Code e a chave PIX Copia e Cola.
- Após o pagamento, a interface deve mudar de "Aguardando Pagamento" para "Aposta Confirmada!", exibindo o link da transação na Solana como comprovante. Este é um momento mágico para o usuário!

**Página "Minhas Apostas" / Histórico:**
- Uma lista detalhada de todas as apostas que o usuário já fez e bilhetes ativos aguardando sorteio.
- Cada item da lista deve mostrar: data, números jogados, valor pago, status (Confirmada, Aguardando Sorteio, Premiada, Não Premiada) e verificação do Has da Transação.
- Concentra também as informações que antigamente residiam no "Meu Painel", simplificando a jornada do usuário.

## 3. Painel do Administrador
Este é o centro de controle do negócio. A interface deve ser focada em dados, gerenciamento e operações. Deve ser uma aplicação web separada e altamente segura.

### Módulos Essenciais:

**Dashboard de Métricas (Visão Geral):**
- **KPIs em Tempo Real:** Faturamento do dia/semana/mês, número de novos usuários, total de apostas no concurso atual, valor do prêmio acumulado.
- **Gráficos:** Evolução da receita, crescimento de usuários, etc.
- **Status do Sistema:** Indicadores visuais mostrando se a API do Mercado Pago, o nó da Solana e o serviço de registro de apostas estão operando normalmente.

**Gerenciamento de Sorteios:**
- Listar todos os sorteios (passados e futuros).
- **Agendamento Automático:** Interface de configuração onde o Admin seleciona dia e hora (ex: Toda Quarta, às 20h). O frontend salva a configuração no backend via `PUT /api/admin/settings/draw-schedule`, automatizando a tarefa no Cloud Scheduler.
- Para um sorteio finalizado, ver um resumo completo: total arrecadado, prêmio total distribuído, número de ganhadores por faixa.
- **Função Crítica:** Uma visão para monitorar e, se necessário, reprocessar pagamentos de prêmios que possam ter falhado.

**Gerenciamento de Usuários:**
- Uma tabela com todos os usuários cadastrados.
- Funcionalidade de busca por nome, e-mail ou CPF.
- Ao clicar em um usuário, ver seu perfil completo, histórico de apostas e prêmios.
- Ferramentas administrativas, como a capacidade de suspender uma conta por suspeita de fraude.

**Monitoramento Financeiro e de Transações:**
- Um log de todas as transações PIX recebidas via Mercado Pago.
- Um log de todas as transações on-chain enviadas para a Solana.
- Filtros para encontrar transações com falha (ex: PIX pago, mas aposta não registrada na blockchain) para que a equipe de suporte possa resolver rapidamente.



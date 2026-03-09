# Telas e Componentes Essenciais por Visão de Usuário

Este documento detalha as telas e componentes essenciais para cada um dos três cenários de usuário do nosso aplicativo.

## 1. Visão do Usuário Deslogado (Visitante)
O objetivo principal aqui é atrair, informar e converter. O visitante precisa entender a proposta de valor rapidamente e se sentir seguro para se cadastrar.

### Telas e Componentes Essenciais:

**Página Inicial (Landing Page):**
- **Headline Principal:** Uma frase de impacto clara e convidativa. Ex: "A loteria transparente que paga no PIX."
- **Prêmio Atual:** Destaque para o valor acumulado do prêmio principal do próximo sorteio. Isso gera urgência e excitação.
- **Botão de Ação (CTA):** Um botão grande e visível para "Entrar com Google" ou "Cadastre-se para Jogar".
- **Seção "Como Funciona":** Um resumo visual e simples em 3 ou 4 passos:
    1. Cadastre-se com sua conta Google.
    2. Escolha seus números e pague com PIX.
    3. Acompanhe o sorteio transparente na blockchain.
    4. Receba prêmios direto na sua conta via PIX!
- **Resultados do Último Sorteio:** Exibir os números sorteados, o número de ganhadores por faixa e o prêmio pago. Isso serve como prova social e demonstra que o jogo é ativo.
- **Seção de Transparência:** Pequenos ícones e textos destacando "Tecnologia Solana", "Sorteio Auditável com Chainlink" e "Pagamento Garantido".

**Página de Resultados Anteriores:**
- Um histórico de todos os sorteios passados.
- Para cada sorteio: data, números sorteados, e para os mais curiosos, um link para a transação do sorteio na blockchain (Solscan/Solana Explorer). Isso reforça a promessa de transparência.

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
- Uma lista detalhada de todas as apostas que o usuário já fez.
- Cada item da lista deve mostrar: data, números jogados, valor pago, status (Confirmada, Aguardando Sorteio, Premiada, Não Premiada) e o valor do prêmio, se aplicável.

**Página de Perfil / Conta:**
- **Dados Pessoais:** Onde o usuário pode visualizar e atualizar seus dados do `paymentProfile` (nome completo, CPF, e principalmente, a chave PIX).
- **Segurança:** Opção de "Sair" (Logout) e, idealmente, uma opção para deletar a conta.

## 3. Painel do Administrador
Este é o centro de controle do negócio. A interface deve ser focada em dados, gerenciamento e operações. Deve ser uma aplicação web separada e altamente segura.

### Módulos Essenciais:

**Dashboard de Métricas (Visão Geral):**
- **KPIs em Tempo Real:** Faturamento do dia/semana/mês, número de novos usuários, total de apostas no concurso atual, valor do prêmio acumulado.
- **Gráficos:** Evolução da receita, crescimento de usuários, etc.
- **Status do Sistema:** Indicadores visuais mostrando se a API do Mercado Pago, o nó da Solana e o serviço de registro de apostas estão operando normalmente.

**Gerenciamento de Sorteios:**
- Listar todos os sorteios (passados e futuros).
- Capacidade de criar um novo concurso, definindo a data e hora do sorteio.
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

**Configurações da Plataforma:**
- Uma área para ajustar parâmetros do jogo sem precisar de um novo deploy de código.
- Exemplos: alterar o preço da aposta, ajustar os percentuais da premiação, mudar textos institucionais do site.

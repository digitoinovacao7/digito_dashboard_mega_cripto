Prompt: Implementação do Fluxo de Onboarding com KYC Simulado
Objetivo: Implementar o fluxo de onboarding completo, incluindo um "portão" de verificação de idade (KYC), utilizando um modo de simulação no backend. O objetivo é permitir testes funcionais de ponta a ponta da plataforma (login, bloqueio, aposta) antes da integração com um serviço de KYC real.

Parte 1: Backend (Rust)
1.1. Variável de Ambiente para Controle de Modo
No seu sistema de configuração (ex: arquivo .env), adicione uma nova variável para controlar o comportamento do KYC:


Recolher
Salvar
Copiar
1
2
3
# .env
KYC_MODE="SIMULATED" 
# Outros valores possíveis: "REAL" (para quando for para produção)
Sua aplicação Rust deve carregar esta variável no início.

1.2. Atualização do Endpoint de Login (/auth/google-login)
Este endpoint precisa informar ao frontend o status de verificação do usuário.

Lógica: Ao processar o login, verifique no Firestore se o usuário tem um campo como isVerified ou kycStatus.
Resposta: Modifique a resposta enviada ao frontend para incluir este status.
Exemplo de Resposta:

json

Recolher
Salvar
Copiar
1
2
3
4
5
6
⌄
⌄
{
  "token": "seu.jwt.aqui",
  "userStatus": {
    "isVerified": false // ou true se o usuário já foi verificado em um login anterior
  }
}
1.3. Implementação do Endpoint de Verificação (/users/complete-profile) com Lógica Condicional
Este é o coração da simulação. O endpoint receberá os dados do formulário de verificação e agirá de acordo com o KYC_MODE.

Payload Esperado do Frontend (em modo SIMULATED):
json

Recolher
Copiar
1
2
3
4
⌄
{
  "simulationType": "APPROVE" // ou "REJECT"
  // Não precisa dos dados reais de CPF/Nome por enquanto
}
Lógica do Endpoint em Rust (Pseudocódigo):
rust

Recolher
Copiar
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
⌄
⌄
⌄
⌄
⌄
async fn handle_kyc_verification(request_body: KycRequest) -&gt; Result&lt;(), ApiError&gt; {
    let kyc_mode = std::env::var("KYC_MODE").unwrap_or("SIMULATED".to_string());

    if kyc_mode == "REAL" {
        // --- LÓGICA DE PRODUÇÃO (a ser implementada no futuro) ---
        // 1. Chamar a API real da BigData Corp / Serasa com os dados do usuário.
        // 2. Com base na resposta, aprovar ou rejeitar.
        // call_real_kyc_api(request_body).await
        unimplemented!("Modo REAL de KYC ainda não implementado.");
    } else {
        // --- LÓGICA DE SIMULAÇÃO (para V1 de testes) ---
        if request_body.simulationType == "APPROVE" {
            // 1. Encontre o usuário no Firestore pelo seu ID (extraído do token JWT).
            // 2. Atualize o documento do usuário para `isVerified: true`.
            // 3. Retorne um status de sucesso (200 OK).
            println!("Simulando aprovação de KYC para o usuário.");
            return Ok(());
        } else {
            // 1. Não faça nada no banco de dados.
            // 2. Retorne um erro (400 Bad Request) com uma mensagem clara.
            println!("Simulando rejeição de KYC para o usuário.");
            return Err(ApiError::ValidationFailed("Simulação: Verificação de KYC falhou."));
        }
    }
}
Parte 2: Frontend (React)
2.1. Gerenciamento de Estado Global
Use uma ferramenta de gerenciamento de estado (Context API, Zustand, Redux) para armazenar o status do usuário em toda a aplicação. O estado deve conter, no mínimo:

isAuthenticated: true ou false
isVerified: true ou false
Estes valores são definidos com base na resposta do endpoint /auth/google-login.

2.2. Implementação do Roteamento Condicional (ProtectedRoute)
Crie um componente que atuará como um "segurança", protegendo as rotas que só podem ser acessadas por usuários logados E verificados.

Exemplo (ProtectedRoute.jsx):

jsx

Recolher
Salvar
Copiar
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
⌄
⌄
⌄
⌄
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth'; // Seu hook de autenticação

const ProtectedRoute = () =&gt; {
  const { isAuthenticated, isVerified, isLoading } = useAuth();

  if (isLoading) {
    return &lt;div&gt;Carregando...&lt;/div&gt;; // Evita redirecionamentos enquanto o status carrega
  }

  if (!isAuthenticated) {
    return &lt;Navigate to="/" replace /&gt;;
  }

  if (!isVerified) {
    return &lt;Navigate to="/verificar-idade" replace /&gt;;
  }

  return &lt;Outlet /&gt;; // Permite o acesso à rota filha (ex: /jogar)
};

export default ProtectedRoute;
2.3. Criação da Página de Verificação Simulada (/verificar-idade)
Esta página é o "portão" onde o usuário não verificado fica retido.

Interface: A página deve ter:
Um título claro: "Verificação de Perfil (Modo de Teste)"
Dois botões distintos:
[Simular Aprovação de KYC]
[Simular Rejeição de KYC]
Um texto explicativo: "Esta é uma tela de simulação para testes. Em produção, aqui haverá um formulário para validação de dados."
Lógica dos Botões:
Botão de Aprovação: Ao ser clicado, faz uma chamada POST para /users/complete-profile com o corpo {"simulationType": "APPROVE"}. Se a resposta for sucesso (200), atualize o estado global para isVerified: true e redirecione o usuário para a página de apostas (/jogar).
Botão de Rejeição: Ao ser clicado, faz uma chamada POST para /users/complete-profile com o corpo {"simulationType": "REJECT"}. Se a resposta for erro (400), exiba uma mensagem de alerta na tela: "Simulação de falha no KYC executada com sucesso.". O usuário permanecerá na mesma página.
Parte 3: Plano de Testes Funcionais
Execute o seguinte roteiro para validar a implementação:

Cenário de Rejeição:
Abra uma janela anônima.
Faça login com uma conta Google nova.
Verifique: Você foi automaticamente redirecionado para a página /verificar-idade?
Clique em [Simular Rejeição de KYC].
Verifique: A mensagem de falha apareceu e você continua na mesma página? Tente acessar /jogar manualmente na URL. Você foi redirecionado de volta para /verificar-idade? (Se sim, sucesso!).
Cenário de Aprovação:
Feche a janela e abra uma nova.
Faça login novamente.
Verifique: Você foi redirecionado para /verificar-idade?
Clique em [Simular Aprovação de KYC].
Verifique: Você foi redirecionado para a página de apostas (/jogar)? Agora, tente navegar para /minhas-apostas e /perfil. O acesso está liberado? (Se sim, sucesso!).
Faça logout e login novamente com a mesma conta.
Verifique: Desta vez, você foi direto para a página de apostas, sem passar pela verificação? (Se sim, o status isVerified foi persistido corretamente, sucesso!).

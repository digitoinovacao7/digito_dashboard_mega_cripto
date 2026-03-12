Prompt: Implementação do Fluxo de Onboarding com KYC Simulado (Preparado para BigData Corp)
Objetivo: Implementar o fluxo de onboarding completo, incluindo um "portão" de verificação de idade (KYC), utilizando um modo de simulação no backend. O design e o código devem ser estruturados de forma que a futura integração com a API da BigData Corp seja uma substituição simples da lógica simulada, sem a necessidade de refatorar toda a arquitetura.

Parte 1: Backend (Rust)
1.1. Variáveis de Ambiente para Controle e Integração
No seu sistema de configuração (ex: arquivo .env), adicione as seguintes variáveis:

# .env

# Controla o modo de operação do KYC

KYC_MODE="SIMULATED"

# Valores possíveis: "SIMULATED", "REAL"

# Chave de API da BigData Corp (deixar em branco por enquanto)

BIGDATACORP_API_KEY=""

# URL do endpoint de validação da BigData Corp

BIGDATACORP_API_URL="https://api.bigdatacloud.net/data/cpf-data" # Exemplo, verificar URL correta na documentação deles
Sua aplicação Rust deve carregar estas variáveis no início.

1.2. Atualização do Endpoint de Login (/auth/google-login)
Nenhuma mudança aqui. Continua como antes, retornando o userStatus.

1.3. Implementação do Endpoint de Verificação (/users/complete-profile) com Lógica Condicional
Este endpoint precisa lidar com dois tipos de payload, dependendo do modo.

Payload Esperado (Modo SIMULATED):
json

Recolher
Copiar
1
{ "simulationType": "APPROVE" } // ou "REJECT"
Payload Esperado (Modo REAL):
json

Recolher
Copiar
1
2
3
4
5
⌄
{
"fullName": "João da Silva",
"taxId": "12345678900",
"birthDate": "1990-05-15"
}
Lógica do Endpoint em Rust (Pseudocódigo Detalhado):
rust

⌄
// Estrutura para receber os dados do frontend
struct KycRequest {
simulationType: Option<String>, // Opcional, usado apenas em modo simulado
fullName: Option<String>,
taxId: Option<String>,
birthDate: Option<String>,
}

async fn handle_kyc_verification(request_body: KycRequest) -> Result<(), ApiError> {
let kyc_mode = std::env::var("KYC_MODE").unwrap_or("SIMULATED".to_string());

    if kyc_mode == "REAL" {
        // --- LÓGICA DE PRODUÇÃO (A SER IMPLEMENTADA) ---
        println!("Executando verificação em modo REAL.");

        // 1. Validar se os dados necessários (fullName, taxId, birthDate) foram recebidos.
        let full_name = request_body.fullName.ok_or(ApiError::MissingData)?;
        let tax_id = request_body.taxId.ok_or(ApiError::MissingData)?;
        let birth_date = request_body.birthDate.ok_or(ApiError::MissingData)?;

        // 2. Chamar a função que encapsula a lógica da BigData Corp.
        // A implementação desta função fica como um TO-DO.
        match call_bigdatacorp_api(full_name, tax_id, birth_date).await {
            Ok(_) => {
                // Se a API da BigData Corp aprovou, atualize o usuário no Firestore.
                update_user_status_as_verified().await?;
                Ok(())
            },
            Err(e) => Err(e),
        }

    } else {
        // --- LÓGICA DE SIMULAÇÃO (PARA TESTES) ---
        println!("Executando verificação em modo SIMULATED.");
        let simulation_type = request_body.simulationType.ok_or(ApiError::MissingData)?;

        if simulation_type == "APPROVE" {
            update_user_status_as_verified().await?;
            Ok(())
        } else {
            Err(ApiError::ValidationFailed("Simulação: Verificação de KYC falhou."))
        }
    }

}

// Função "stub" (espaço reservado) para a integração real.
async fn call_bigdatacorp_api(name: String, cpf: String, dob: String) -> Result<(), ApiError> {
// TO-DO: Implementar a chamada HTTP real para a API da BigData Corp aqui.
// 1. Carregar a BIGDATACORP_API_KEY e BIGDATACORP_API_URL das variáveis de ambiente.
// 2. Montar o corpo da requisição conforme a documentação da BigData Corp.
// 3. Fazer a chamada com 'reqwest'.
// 4. Analisar a resposta e retornar Ok(()) se aprovado, ou Err(ApiError) se reprovado.

    // Por enquanto, apenas logamos e retornamos um erro de "não implementado".
    println!("CHAMADA REAL PARA BIGDATACORP AINDA NÃO IMPLEMENTADA.");
    unimplemented!("A integração com a BigData Corp será feita nesta função.");

}
Parte 2: Frontend (React)
2.1. Gerenciamento de Estado Global
Nenhuma mudança aqui.

2.2. Implementação do Roteamento Condicional (ProtectedRoute)
Nenhuma mudança aqui.

2.3. Criação da Página de Verificação Simulada (/verificar-idade)
Aqui, vamos adicionar uma pequena nota para deixar claro o que acontecerá no futuro.

Interface:
Título: "Verificação de Perfil (Modo de Teste)"
Texto Explicativo: "Esta é uma tela para testes. Em produção, aqui haverá um formulário para validação de Nome, CPF e Data de Nascimento via BigData Corp."
Botões:
[Simular Aprovação de KYC]
[Simular Rejeição de KYC]
Lógica dos Botões:
Aprovação: Chama POST /users/complete-profile com {"simulationType": "APPROVE"}.
Rejeição: Chama POST /users/complete-profile com {"simulationType": "REJECT"}.

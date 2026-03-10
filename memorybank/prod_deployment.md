# Guia Rápido de Deploy: Backend Rust no Google Cloud Run

Este guia apresenta os comandos essenciais para publicar o backend Rust (`mega-cripto-uai`) no Google Cloud Run.

---

### Pré-requisitos

1.  **Google Cloud CLI (`gcloud`) instalado e autenticado.**
2.  **Docker instalado.**
3.  **`Dockerfile` no diretório `/backend`:** Certifique-se de que o arquivo `Dockerfile` existe no diretório `backend` com o conteúdo correto para containerizar a aplicação.

---

### Passo 1: Configuração Inicial do Google Cloud (Executar uma vez)

1.  **Habilitar APIs:**
    ```bash
    gcloud services enable run.googleapis.com artifactregistry.googleapis.com
    ```

2.  **Criar Repositório Docker:**
    ```bash
    gcloud artifacts repositories create mega-cripto-uai-repo \
        --repository-format=docker \
        --location=southamerica-east1 \
        --description="Repositório para a API da Mega Cripto UAI"
    ```

3.  **Autenticar Docker:**
    ```bash
    gcloud auth configure-docker southamerica-east1-docker.pkg.dev
    ```

---

### Passo 2: Build e Push da Imagem Docker

Execute os seguintes comandos de dentro do diretório `/backend`. **Lembre-se de substituir `[ID_DO_SEU_PROJETO_GCP]`** pelo ID do seu projeto no Google Cloud.

1.  **Construir a imagem:**
    ```bash
    docker build -t mega-cripto-uai-api .
    ```

2.  **Taguear a imagem:**
    ```bash
    docker tag mega-cripto-uai-api southamerica-east1-docker.pkg.dev/[ID_DO_SEU_PROJETO_GCP]/mega-cripto-uai-repo/mega-cripto-uai-api:latest
    ```

3.  **Enviar a imagem:**
    ```bash
    docker push southamerica-east1-docker.pkg.dev/[ID_DO_SEU_PROJETO_GCP]/mega-cripto-uai-repo/mega-cripto-uai-api:latest
    ```

---

### Passo 3: Deploy no Cloud Run

Execute o comando a seguir para publicar ou atualizar sua API. **Substitua `[ID_DO_SEU_PROJETO_GCP]`** e o valor de `MERCADO_PAGO_ACCESS_TOKEN`.

```bash
gcloud run deploy mega-cripto-uai-api \
  --image=southamerica-east1-docker.pkg.dev/[ID_DO_SEU_PROJETO_GCP]/mega-cripto-uai-repo/mega-cripto-uai-api:latest \
  --platform=managed \
  --region=southamerica-east1 \
  --allow-unauthenticated \
  --port=3000 \
  --set-env-vars="RUST_LOG=info,MERCADO_PAGO_ACCESS_TOKEN=SEU_TOKEN_AQUI"
```

Ao final, o Google Cloud fornecerá a URL pública da sua API.

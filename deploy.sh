#!/bin/bash

# Este script automatiza o deploy do backend Rust para o Google Cloud Run.

# Para o script se um comando falhar
set -e

# --- Validação dos Parâmetros ---
if [ -z "$1" ]; then
  echo "Erro: O ID do Projeto GCP é obrigatório."
  echo "Uso: ./deploy.sh <ID_DO_PROJETO_GCP>"
  exit 1
fi

GCP_PROJECT_ID=$1

echo "🚀 Iniciando o deploy para o projeto: $GCP_PROJECT_ID"

# --- Passo 1: Navegar para o diretório do backend ---
echo "➡️  Navegando para o diretório 'backend'..."
# Garante que o script seja executado a partir da raiz do projeto
cd "$(dirname "$0")/backend"

# --- Passo 2: Build e Push usando Google Cloud Build ---
# Não requer Docker instalado localmente
IMAGE_TAG="southamerica-east1-docker.pkg.dev/$GCP_PROJECT_ID/mega-cripto-uai-repo/mega-cripto-uai-api:latest"

echo "🛠️  Construindo e enviando a imagem via Cloud Build..."
gcloud builds submit --tag "$IMAGE_TAG" .

# --- Passo 3: Deploy no Cloud Run ---
echo "☁️  Fazendo o deploy no Google Cloud Run..."
gcloud run deploy mega-cripto-uai-api \
  --image="$IMAGE_TAG" \
  --platform=managed \
  --region=southamerica-east1 \
  --allow-unauthenticated \
  --port=3000 \
  --set-env-vars="RUST_LOG=info" \
  --project="$GCP_PROJECT_ID" \
  --quiet

echo "✅ Deploy concluído com sucesso!"
echo "URL da API estará disponível em breve no seu console do Google Cloud."

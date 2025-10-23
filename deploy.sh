#!/bin/bash

# Script de deploy para Google Cloud Run - SIRAOP
# Uso: ./deploy.sh [PROJECT_ID]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se o PROJECT_ID foi fornecido
if [ -z "$1" ]; then
    print_error "PROJECT_ID é obrigatório!"
    echo "Uso: ./deploy.sh [PROJECT_ID]"
    echo "Exemplo: ./deploy.sh meu-projeto-123"
    exit 1
fi

PROJECT_ID=$1
REGION="us-central1"

print_status "Iniciando deploy do SIRAOP para o projeto: $PROJECT_ID"

# Verificar se o gcloud está instalado e configurado
if ! command -v gcloud &> /dev/null; then
    print_error "Google Cloud CLI não está instalado!"
    echo "Instale em: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Verificar se está autenticado
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_error "Não está autenticado no Google Cloud!"
    echo "Execute: gcloud auth login"
    exit 1
fi

# Configurar projeto
print_status "Configurando projeto: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Habilitar APIs necessárias
print_status "Habilitando APIs necessárias..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage.googleapis.com

# Configurar Docker para usar gcloud como credential helper
print_status "Configurando Docker para Google Container Registry..."
gcloud auth configure-docker

# Build e push das imagens
print_status "Fazendo build e push das imagens Docker..."

# Backend API
print_status "Buildando backend API..."
docker build -t gcr.io/$PROJECT_ID/siraop-api:latest ./backend-api
docker push gcr.io/$PROJECT_ID/siraop-api:latest

# Frontend PWA
print_status "Buildando frontend PWA..."
docker build -t gcr.io/$PROJECT_ID/siraop-frontend:latest ./frontend-pwa
docker push gcr.io/$PROJECT_ID/siraop-frontend:latest

# Deploy no Cloud Run
print_status "Fazendo deploy no Cloud Run..."

# Deploy da API
print_status "Deployando API backend..."
gcloud run deploy siraop-api \
  --image gcr.io/$PROJECT_ID/siraop-api:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production

# Deploy do Frontend
print_status "Deployando frontend PWA..."
gcloud run deploy siraop-frontend \
  --image gcr.io/$PROJECT_ID/siraop-frontend:latest \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars NODE_ENV=production

# Obter URLs dos serviços
API_URL=$(gcloud run services describe siraop-api --region=$REGION --format="value(status.url)")
FRONTEND_URL=$(gcloud run services describe siraop-frontend --region=$REGION --format="value(status.url)")

print_success "Deploy concluído com sucesso!"
echo ""
echo "🌐 URLs dos serviços:"
echo "  API Backend: $API_URL"
echo "  Frontend PWA: $FRONTEND_URL"
echo ""
print_warning "Próximos passos:"
echo "1. Configure o banco de dados Cloud SQL com PostGIS"
echo "2. Configure as variáveis de ambiente nos serviços"
echo "3. Configure o Google Cloud Storage"
echo "4. Teste os serviços"
echo ""
print_status "Para configurar variáveis de ambiente:"
echo "gcloud run services update siraop-api --set-env-vars=\"VAR_NAME=value\" --region=$REGION"
echo "gcloud run services update siraop-frontend --set-env-vars=\"VAR_NAME=value\" --region=$REGION"

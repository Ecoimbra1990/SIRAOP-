#!/bin/bash

# Script de diagnóstico para problemas de build do SIRAOP
# Uso: ./debug-build.sh [PROJECT_ID]

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
    echo "Uso: ./debug-build.sh [PROJECT_ID]"
    echo "Exemplo: ./debug-build.sh meu-projeto-123"
    exit 1
fi

PROJECT_ID=$1
COMMIT_SHA=$(git rev-parse HEAD)

print_status "Diagnosticando problemas de build para o projeto: $PROJECT_ID"
print_status "Commit SHA: $COMMIT_SHA"

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

# Verificar se as APIs estão habilitadas
print_status "Verificando APIs habilitadas..."
gcloud services list --enabled --filter="name:cloudbuild.googleapis.com OR name:run.googleapis.com"

# Testar build local do backend
print_status "Testando build local do backend..."
if docker build -t test-backend ./backend-api; then
    print_success "Build do backend funcionou localmente"
    docker rmi test-backend
else
    print_error "Build do backend falhou localmente"
fi

# Testar build local do frontend
print_status "Testando build local do frontend..."
if docker build -t test-frontend ./frontend-pwa; then
    print_success "Build do frontend funcionou localmente"
    docker rmi test-frontend
else
    print_error "Build do frontend falhou localmente"
fi

# Verificar formato das tags
print_status "Verificando formato das tags Docker..."
BACKEND_TAG="gcr.io/$PROJECT_ID/siraop-api:$COMMIT_SHA"
FRONTEND_TAG="gcr.io/$PROJECT_ID/siraop-frontend:$COMMIT_SHA"

echo "Backend tag: $BACKEND_TAG"
echo "Frontend tag: $FRONTEND_TAG"

# Verificar se as tags são válidas
if [[ $BACKEND_TAG =~ ^[a-z0-9._/-]+:[a-zA-Z0-9._-]+$ ]]; then
    print_success "Formato da tag do backend é válido"
else
    print_error "Formato da tag do backend é inválido"
fi

if [[ $FRONTEND_TAG =~ ^[a-z0-9._/-]+:[a-zA-Z0-9._-]+$ ]]; then
    print_success "Formato da tag do frontend é válido"
else
    print_error "Formato da tag do frontend é inválido"
fi

# Verificar se o Container Registry está acessível
print_status "Verificando acesso ao Container Registry..."
if gcloud auth configure-docker; then
    print_success "Docker configurado para usar gcloud"
else
    print_error "Falha ao configurar Docker para gcloud"
fi

print_status "Diagnóstico concluído!"
print_warning "Se todos os testes passaram, o problema pode estar na configuração do Cloud Build."
print_warning "Tente usar o arquivo cloudbuild-simple.yaml em vez do cloudbuild.yaml"

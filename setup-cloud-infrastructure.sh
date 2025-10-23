#!/bin/bash

# Script para configurar infraestrutura do Google Cloud para SIRAOP
# Uso: ./setup-cloud-infrastructure.sh [PROJECT_ID] [REGION]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Verificar parâmetros
if [ -z "$1" ]; then
    print_error "PROJECT_ID é obrigatório!"
    echo "Uso: ./setup-cloud-infrastructure.sh [PROJECT_ID] [REGION]"
    echo "Exemplo: ./setup-cloud-infrastructure.sh meu-projeto-123 us-central1"
    exit 1
fi

PROJECT_ID=$1
REGION=${2:-us-central1}
INSTANCE_NAME="siraop-db"
DB_NAME="siraop_db"
DB_USER="postgres"
BUCKET_NAME="siraop-storage-$(date +%s)"

print_status "Configurando infraestrutura para o projeto: $PROJECT_ID"
print_status "Região: $REGION"

# Configurar projeto
gcloud config set project $PROJECT_ID

# Habilitar APIs necessárias
print_status "Habilitando APIs necessárias..."
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable iam.googleapis.com

# Criar instância Cloud SQL
print_status "Criando instância Cloud SQL PostgreSQL..."
gcloud sql instances create $INSTANCE_NAME \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=$REGION \
    --storage-type=SSD \
    --storage-size=20GB \
    --storage-auto-increase \
    --backup \
    --enable-bin-log \
    --maintenance-window-day=SUN \
    --maintenance-window-hour=3 \
    --authorized-networks=0.0.0.0/0

# Aguardar instância ficar pronta
print_status "Aguardando instância Cloud SQL ficar pronta..."
gcloud sql instances describe $INSTANCE_NAME --format="value(state)" | grep -q RUNNABLE || sleep 30

# Definir senha do banco
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
print_status "Definindo senha do banco de dados..."
gcloud sql users set-password $DB_USER \
    --instance=$INSTANCE_NAME \
    --password=$DB_PASSWORD

# Criar banco de dados
print_status "Criando banco de dados..."
gcloud sql databases create $DB_NAME --instance=$INSTANCE_NAME

# Obter IP da instância
DB_IP=$(gcloud sql instances describe $INSTANCE_NAME --format="value(ipAddresses[0].ipAddress)")

# Criar bucket do Cloud Storage
print_status "Criando bucket do Cloud Storage..."
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$BUCKET_NAME

# Configurar permissões do bucket
print_status "Configurando permissões do bucket..."
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Criar Service Account
print_status "Criando Service Account..."
gcloud iam service-accounts create siraop-service-account \
    --display-name="SIRAOP Service Account" \
    --description="Service Account para SIRAOP"

# Configurar permissões da Service Account
print_status "Configurando permissões da Service Account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:siraop-service-account@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:siraop-service-account@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Criar chave da Service Account
print_status "Criando chave da Service Account..."
gcloud iam service-accounts keys create siraop-service-account-key.json \
    --iam-account=siraop-service-account@$PROJECT_ID.iam.gserviceaccount.com

# Obter connection name
CONNECTION_NAME="$PROJECT_ID:$REGION:$INSTANCE_NAME"

print_success "Infraestrutura configurada com sucesso!"
echo ""
echo "📋 INFORMAÇÕES DA INFRAESTRUTURA:"
echo "  Projeto: $PROJECT_ID"
echo "  Região: $REGION"
echo "  Instância Cloud SQL: $INSTANCE_NAME"
echo "  Banco de dados: $DB_NAME"
echo "  Usuário: $DB_USER"
echo "  Senha: $DB_PASSWORD"
echo "  IP do banco: $DB_IP"
echo "  Bucket Storage: $BUCKET_NAME"
echo "  Connection Name: $CONNECTION_NAME"
echo ""
echo "📁 ARQUIVOS CRIADOS:"
echo "  - siraop-service-account-key.json (chave da service account)"
echo ""
print_warning "PRÓXIMOS PASSOS:"
echo "1. Execute o script cloud-sql-setup.sql no banco de dados"
echo "2. Configure as variáveis de ambiente nos serviços Cloud Run"
echo "3. Faça o deploy das aplicações"
echo ""
print_status "Para conectar ao banco e executar o script:"
echo "gcloud sql connect $INSTANCE_NAME --user=$DB_USER --database=$DB_NAME"
echo ""
print_status "Para configurar variáveis de ambiente:"
echo "gcloud run services update siraop-api \\"
echo "  --set-env-vars=\"PG_HOST=/cloudsql/$CONNECTION_NAME\" \\"
echo "  --set-env-vars=\"PG_PASSWORD=$DB_PASSWORD\" \\"
echo "  --set-env-vars=\"GCS_BUCKET_NAME=$BUCKET_NAME\" \\"
echo "  --set-env-vars=\"GCP_PROJECT_ID=$PROJECT_ID\" \\"
echo "  --region=$REGION"

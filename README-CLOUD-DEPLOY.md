# 🚀 Deploy do SIRAOP no Google Cloud Run

Este guia explica como fazer o deploy completo do sistema SIRAOP no Google Cloud Run.

## 📋 Pré-requisitos

- Conta Google Cloud com billing habilitado
- Google Cloud CLI instalado e configurado
- Docker instalado
- Node.js 18+ (para desenvolvimento local)

## 🏗️ Passo a Passo do Deploy

### 1. Configurar Projeto Google Cloud

```bash
# Fazer login no Google Cloud
gcloud auth login

# Criar novo projeto (ou usar existente)
gcloud projects create SEU_PROJECT_ID
gcloud config set project SEU_PROJECT_ID

# Habilitar billing (necessário para Cloud SQL)
# Faça isso no Console do Google Cloud
```

### 2. Configurar Infraestrutura

```bash
# Executar script de configuração da infraestrutura
./setup-cloud-infrastructure.sh SEU_PROJECT_ID us-central1
```

Este script irá:
- ✅ Criar instância Cloud SQL PostgreSQL
- ✅ Configurar PostGIS
- ✅ Criar bucket Cloud Storage
- ✅ Criar Service Account
- ✅ Configurar permissões

### 3. Configurar Banco de Dados

```bash
# Conectar ao banco e executar script de configuração
gcloud sql connect siraop-db --user=postgres --database=siraop_db

# No prompt do PostgreSQL, execute:
\i cloud-sql-setup.sql
```

### 4. Deploy das Aplicações

```bash
# Deploy automático
./deploy.sh SEU_PROJECT_ID
```

Ou deploy manual:

```bash
# Build e push das imagens
docker build -t gcr.io/SEU_PROJECT_ID/siraop-api:latest ./backend-api
docker push gcr.io/SEU_PROJECT_ID/siraop-api:latest

docker build -t gcr.io/SEU_PROJECT_ID/siraop-frontend:latest ./frontend-pwa
docker push gcr.io/SEU_PROJECT_ID/siraop-frontend:latest

# Deploy no Cloud Run
gcloud run deploy siraop-api \
  --image gcr.io/SEU_PROJECT_ID/siraop-api:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 2

gcloud run deploy siraop-frontend \
  --image gcr.io/SEU_PROJECT_ID/siraop-frontend:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1
```

### 5. Configurar Variáveis de Ambiente

```bash
# Obter URLs dos serviços
API_URL=$(gcloud run services describe siraop-api --region=us-central1 --format="value(status.url)")
FRONTEND_URL=$(gcloud run services describe siraop-frontend --region=us-central1 --format="value(status.url)")

# Configurar variáveis da API
gcloud run services update siraop-api \
  --set-env-vars="PG_HOST=/cloudsql/SEU_PROJECT_ID:us-central1:siraop-db" \
  --set-env-vars="PG_PASSWORD=SUA_SENHA_DO_BANCO" \
  --set-env-vars="JWT_SECRET=$(openssl rand -base64 32)" \
  --set-env-vars="CPF_ENCRYPTION_KEY=$(openssl rand -base64 32 | cut -c1-32)" \
  --set-env-vars="GCS_BUCKET_NAME=siraop-storage-XXXXX" \
  --set-env-vars="GCP_PROJECT_ID=SEU_PROJECT_ID" \
  --set-env-vars="FRONTEND_URL=$FRONTEND_URL" \
  --region=us-central1

# Configurar variáveis do Frontend
gcloud run services update siraop-frontend \
  --set-env-vars="NEXT_PUBLIC_API_URL=$API_URL/api" \
  --region=us-central1
```

## 🔧 Configurações Avançadas

### Configurar Cloud SQL com IP Privado

```bash
# Criar VPC (se necessário)
gcloud compute networks create siraop-vpc --subnet-mode=regional

# Configurar Cloud SQL com IP privado
gcloud sql instances patch siraop-db \
  --network=projects/SEU_PROJECT_ID/global/networks/siraop-vpc \
  --no-assign-ip
```

### Configurar Domínio Personalizado

```bash
# Mapear domínio para Cloud Run
gcloud run domain-mappings create \
  --service siraop-frontend \
  --domain api.siraop.com \
  --region us-central1
```

### Configurar SSL/TLS

```bash
# SSL é configurado automaticamente pelo Cloud Run
# Para domínios personalizados, configure no Console
```

## 📊 Monitoramento

### Logs

```bash
# Ver logs da API
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=siraop-api" --limit 50

# Ver logs do Frontend
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=siraop-frontend" --limit 50
```

### Métricas

```bash
# Ver métricas de performance
gcloud monitoring metrics list --filter="resource.type=cloud_run_revision"
```

## 🔒 Segurança

### Configurar IAM

```bash
# Restringir acesso aos serviços
gcloud run services remove-iam-policy-binding siraop-api \
  --member="allUsers" \
  --role="roles/run.invoker"

# Adicionar usuários específicos
gcloud run services add-iam-policy-binding siraop-api \
  --member="user:usuario@exemplo.com" \
  --role="roles/run.invoker"
```

### Configurar CORS

```bash
# CORS é configurado no código da aplicação
# Verifique as configurações em backend-api/src/main.ts
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco:**
   ```bash
   # Verificar se a instância está rodando
   gcloud sql instances describe siraop-db
   
   # Verificar logs
   gcloud sql operations list --instance=siraop-db
   ```

2. **Erro de permissões:**
   ```bash
   # Verificar permissões da Service Account
   gcloud projects get-iam-policy SEU_PROJECT_ID
   ```

3. **Erro de build:**
   ```bash
   # Verificar logs do Cloud Build
   gcloud builds list --limit=10
   gcloud builds log [BUILD_ID]
   ```

### Verificar Status dos Serviços

```bash
# Status da API
gcloud run services describe siraop-api --region=us-central1

# Status do Frontend
gcloud run services describe siraop-frontend --region=us-central1

# Status do banco
gcloud sql instances describe siraop-db
```

## 💰 Custos Estimados

### Cloud Run
- **API**: ~$5-15/mês (2 vCPU, 2GB RAM)
- **Frontend**: ~$2-8/mês (1 vCPU, 1GB RAM)

### Cloud SQL
- **db-f1-micro**: ~$7-10/mês
- **db-g1-small**: ~$15-20/mês

### Cloud Storage
- **Standard**: ~$0.02/GB/mês
- **Operações**: ~$0.004/10k operações

### Total Estimado: $15-50/mês

## 📞 Suporte

Para problemas técnicos:
1. Verifique os logs do Cloud Run
2. Verifique as métricas do Cloud SQL
3. Consulte a documentação do Google Cloud
4. Entre em contato com a equipe de desenvolvimento

---

**SIRAOP** - Sistema de Registro e Análise de Ocorrências Policiais

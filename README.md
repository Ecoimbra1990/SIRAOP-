# SIRAOP - Sistema de Registro e Análise de Ocorrências Policiais

Sistema mobile-first para registro e análise de ocorrências policiais, desenvolvido para ser implantado no Google Cloud Run.

## 🚀 Características

- **Mobile-First**: Interface responsiva otimizada para smartphones
- **Seguro**: Autenticação JWT e dados sensíveis criptografados
- **Cloud-Ready**: Pronto para implantação no Google Cloud Run
- **Geolocalização**: Integração com PostGIS para consultas espaciais
- **PWA**: Progressive Web App com funcionalidades offline
- **Relatórios**: Geração automática de PDFs com Puppeteer

## 🛠️ Stack Tecnológica

### Backend (NestJS)
- **Framework**: NestJS com TypeScript
- **Banco de Dados**: PostgreSQL + PostGIS
- **ORM**: TypeORM
- **Autenticação**: JWT
- **Upload**: Google Cloud Storage
- **PDF**: Puppeteer
- **Containerização**: Docker

### Frontend (Next.js 14)
- **Framework**: Next.js 14 com App Router
- **Styling**: TailwindCSS
- **Estado**: Zustand
- **Mapas**: React-Leaflet
- **Formulários**: React Hook Form + Zod
- **HTTP**: Axios

## 📁 Estrutura do Projeto

```
siraop-project/
├── backend-api/          # API NestJS
│   ├── src/
│   │   ├── auth/         # Autenticação JWT
│   │   ├── users/        # Usuários (Policiais)
│   │   ├── ocorrencias/  # Ocorrências
│   │   ├── pessoas/      # Pessoas/Faccionados
│   │   ├── veiculos/     # Veículos
│   │   ├── armas/        # Armas
│   │   ├── faccoes/      # Facções
│   │   ├── storage/      # Google Cloud Storage
│   │   ├── relatorios/   # Geração de PDF
│   │   └── gis/          # Utilitários PostGIS
│   └── Dockerfile        # Container para Cloud Run
│
├── frontend-pwa/         # PWA Next.js
│   ├── app/
│   │   ├── login/        # Página de login
│   │   └── (protected)/  # Rotas protegidas
│   │       ├── dashboard/     # Dashboard principal
│   │       ├── ocorrencias/   # CRUD de ocorrências
│   │       └── pessoas/       # CRUD de pessoas
│   ├── components/       # Componentes React
│   ├── lib/             # Configurações e utilitários
│   └── store/           # Gerenciamento de estado
│
└── README.md
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- PostgreSQL com PostGIS
- Docker (para desenvolvimento local)
- Conta Google Cloud (para produção)

### 1. Clone o repositório
```bash
git clone <repository-url>
cd siraop-project
```

### 2. Backend (API)

```bash
cd backend-api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com suas configurações

# Executar migrações (desenvolvimento)
npm run build
npm run start:dev
```

### 3. Frontend (PWA)

```bash
cd frontend-pwa

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env.local
# Edite o arquivo .env.local com suas configurações

# Executar em modo desenvolvimento
npm run dev
```

### 4. Banco de Dados

```sql
-- Criar banco de dados
CREATE DATABASE siraop_db;

-- Instalar extensão PostGIS
\c siraop_db;
CREATE EXTENSION IF NOT EXISTS postgis;
```

## 🐳 Docker

### Desenvolvimento Local
```bash
# Backend
cd backend-api
docker build -t siraop-api .
docker run -p 8080:8080 siraop-api

# Frontend
cd frontend-pwa
docker build -t siraop-frontend .
docker run -p 3000:3000 siraop-frontend
```

### Produção (Google Cloud Run)
```bash
# Build e push da imagem
gcloud builds submit --tag gcr.io/PROJECT_ID/siraop-api backend-api/
gcloud builds submit --tag gcr.io/PROJECT_ID/siraop-frontend frontend-pwa/

# Deploy no Cloud Run
gcloud run deploy siraop-api --image gcr.io/PROJECT_ID/siraop-api --platform managed
gcloud run deploy siraop-frontend --image gcr.io/PROJECT_ID/siraop-frontend --platform managed
```

## 📱 Funcionalidades

### Dashboard
- Lista de ocorrências com filtros
- Seleção múltipla para relatórios
- Geração de PDFs informativos
- Interface mobile-first

### Ocorrências
- CRUD completo de ocorrências
- Geolocalização com mapas interativos
- Upload de anexos
- Compartilhamento via WhatsApp

### Pessoas/Faccionados
- Cadastro de pessoas com dados sensíveis criptografados
- Áreas de atuação com polígonos no mapa
- Upload de fotos
- Relacionamento com facções

### Relatórios
- Geração automática de PDFs
- Seleção múltipla de ocorrências
- Template profissional
- Download direto

## 🔒 Segurança

- Autenticação JWT
- Criptografia de dados sensíveis (CPF)
- Validação de entrada com class-validator
- CORS configurado
- Headers de segurança

## 🌍 Geolocalização

- Integração com PostGIS
- Consultas espaciais (proximidade)
- Mapas interativos com Leaflet
- Seleção de coordenadas
- Desenho de polígonos

## 📊 Monitoramento

- Logs estruturados
- Health checks
- Métricas de performance
- Tratamento de erros

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da instituição e está sob licença proprietária.

## 📞 Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento.

---

**SIRAOP** - Sistema de Registro e Análise de Ocorrências Policiais

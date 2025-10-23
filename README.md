# SIRAOP - Sistema de Registro e Análise de Ocorrências Policiais

Sistema mobile-first para registro e análise de ocorrências policiais, desenvolvido com arquitetura moderna e escalável.

## 🚀 Características

- **Mobile-First**: Interface responsiva otimizada para smartphones
- **Seguro**: Autenticação JWT e dados sensíveis criptografados
- **Cloud-Ready**: Pronto para implantação em múltiplas plataformas
- **Geolocalização**: Integração com PostGIS para consultas espaciais
- **PWA**: Progressive Web App com funcionalidades offline
- **Relatórios**: Geração automática de PDFs com Puppeteer

## 🛠️ Stack Tecnológica

### Backend (NestJS)
- **Framework**: NestJS com TypeScript
- **Banco de Dados**: Supabase (PostgreSQL + PostGIS)
- **ORM**: TypeORM
- **Autenticação**: JWT
- **Upload**: Supabase Storage
- **PDF**: Puppeteer
- **Deploy**: Fly.io

### Frontend (Next.js 14)
- **Framework**: Next.js 14 com App Router
- **Styling**: TailwindCSS
- **Estado**: Zustand
- **Mapas**: React-Leaflet
- **Formulários**: React Hook Form + Zod
- **HTTP**: Axios
- **Deploy**: Firebase Hosting

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
│   │   ├── storage/      # Supabase Storage
│   │   ├── relatorios/   # Geração de PDF
│   │   └── gis/          # Utilitários PostGIS
│   ├── Dockerfile        # Container para Fly.io
│   └── fly.toml          # Configuração Fly.io
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
│   ├── store/           # Gerenciamento de estado
│   ├── firebase.json    # Configuração Firebase
│   └── .firebaserc      # Projeto Firebase
│
└── README.md
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- Supabase (banco de dados)
- Docker (para desenvolvimento local)
- Conta Firebase (para frontend)
- Conta Fly.io (para backend)

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

### 4. Configurar Supabase

```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar projeto Supabase
supabase init

# Configurar variáveis de ambiente
# Adicione as credenciais do Supabase no .env
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

### Produção

#### Backend (Fly.io)
```bash
# Instalar Fly CLI
curl -L https://fly.io/install.sh | sh

# Login no Fly.io
fly auth login

# Deploy do backend
cd backend-api
fly deploy
```

#### Frontend (Firebase)
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Deploy do frontend
cd frontend-pwa
firebase deploy
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

# Configuração do Supabase para SIRAOP

## 🗄️ Configuração do Banco de Dados

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização
5. Configure:
   - **Name**: `siraop-database`
   - **Database Password**: (senha segura)
   - **Region**: Escolha a região mais próxima (ex: South America - São Paulo)

### 2. Configurar PostGIS

Após criar o projeto, execute no SQL Editor do Supabase:

```sql
-- Habilitar extensão PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

-- Verificar instalação
SELECT PostGIS_Version();
```

### 3. Configurar Storage

1. No painel do Supabase, vá para **Storage**
2. Crie um novo bucket:
   - **Name**: `siraop-files`
   - **Public**: `false` (para arquivos privados)
3. Configure as políticas RLS (Row Level Security) conforme necessário

### 4. Configurar Autenticação

1. Vá para **Authentication** > **Settings**
2. Configure:
   - **Site URL**: `https://seu-projeto.firebaseapp.com`
   - **Redirect URLs**: Adicione as URLs do seu frontend
3. Desabilite o registro público se necessário

## 🔧 Variáveis de Ambiente

### Backend (Fly.io)

Configure as seguintes variáveis no Fly.io:

```bash
# Supabase Database
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# JWT
JWT_SECRET=sua-chave-jwt-secreta

# Criptografia
CPF_ENCRYPTION_KEY=sua-chave-criptografia-32-chars

# Supabase Storage
SUPABASE_STORAGE_BUCKET=siraop-files
```

### Frontend (Firebase)

Configure no arquivo `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima

# API Backend
NEXT_PUBLIC_API_URL=https://seu-app.fly.dev
```

## 📊 Estrutura do Banco

O TypeORM irá criar automaticamente as tabelas baseadas nas entidades:

- `users` - Usuários (policiais)
- `ocorrencias` - Ocorrências policiais
- `pessoas` - Pessoas/faccionados
- `veiculos` - Veículos
- `armas` - Armas
- `faccoes` - Facções criminosas
- `areas_atuacao` - Áreas de atuação (polígonos)

## 🔒 Segurança

### Row Level Security (RLS)

Configure as políticas RLS no Supabase:

```sql
-- Exemplo: Apenas usuários autenticados podem ver dados
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
```

### Storage Policies

```sql
-- Exemplo: Apenas usuários autenticados podem fazer upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## 🚀 Deploy

1. Configure as variáveis de ambiente
2. Execute o script de deploy: `./deploy-new-architecture.sh`
3. Teste os serviços
4. Configure domínio personalizado se necessário

## 📞 Suporte

Para problemas com Supabase:
- [Documentação oficial](https://supabase.com/docs)
- [Comunidade Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

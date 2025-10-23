# 🔧 Correção do Deploy no Railway

## ❌ **PROBLEMA IDENTIFICADO**

O Railway está tentando fazer o deploy na raiz do projeto, mas precisa ser configurado para o diretório `backend-api`.

## ✅ **SOLUÇÃO**

### **1. Configurar Root Directory no Railway**

1. **No Railway, vá em "Settings"**
2. **Clique em "Source"**
3. **Configure**:
   - **Root Directory**: `backend-api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### **2. Arquivos de Configuração Criados**

- `railway.json` - Configuração na raiz
- `backend-api/railway.json` - Configuração específica do backend

### **3. Configuração Correta**

**Root Directory**: `backend-api`
**Build Command**: `npm install && npm run build`
**Start Command**: `npm start`

## 🚀 **PASSOS PARA CORRIGIR**

### **1. No Railway Dashboard**
1. **Vá em "Settings"** do seu projeto
2. **Clique em "Source"**
3. **Configure Root Directory**: `backend-api`
4. **Salve as configurações**

### **2. Adicionar Banco de Dados**
1. **Clique em "New"**
2. **Selecione "Database"**
3. **Escolha "PostgreSQL"**
4. **Copie a URL de conexão**

### **3. Configurar Variáveis de Ambiente**
Adicione estas variáveis:
```
NODE_ENV=production
PORT=8080
DATABASE_URL=[URL_DO_BANCO_COPIADA]
JWT_SECRET=MDNmMjhmY2ItNzhlNS00ZTMyLWFhODktNDdkYTA5ODEyMDY2ZTdlZGUwZDAtOGEyZi00MjI4LWEyNmQtZmMxOWM3MGNmNTEw
CPF_ENCRYPTION_KEY=Mzk1MDI2YTEtNDM5OS00YTZmLTkzN2ItMzk4YzNkZGI1YmE4YzRkZGU2ZDUtZThmYy00MmExLWEyNDYtYzkyMTExZWEyM2E1
DB_TIMEOUT=30000
LOG_LEVEL=info
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
```

## ✅ **RESULTADO**

Após a correção, o Railway deve conseguir fazer o deploy corretamente do backend.

---

**🎯 Siga os passos acima para corrigir o deploy no Railway!**

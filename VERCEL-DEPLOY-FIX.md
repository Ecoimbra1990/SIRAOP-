# 🔧 Correção do Deploy no Vercel

## ✅ **PROBLEMAS CORRIGIDOS**

### **1. Dependência Problemática**
- **Removido**: `@types/leaflet-draw@^0.4.17` (não existe)
- **Criado**: Arquivo de tipos personalizado `types/leaflet-draw.d.ts`

### **2. Configuração do TypeScript**
- **Atualizado**: `tsconfig.json` para incluir tipos personalizados
- **Adicionado**: `"types/**/*.d.ts"` no include

### **3. Configuração do Next.js**
- **Removido**: `experimental.appDir: true` (não necessário na v14)
- **Mantido**: Configurações de segurança e imagens

### **4. Configuração do Vercel**
- **Criado**: `vercel.json` com configurações otimizadas

## 🚀 **DEPLOY NO VERCEL**

### **Passo 1: Preparar Repositório**
```bash
# Fazer commit das correções
git add .
git commit -m "Fix: Corrigir dependências para deploy no Vercel"
git push origin main
```

### **Passo 2: Deploy no Vercel**
1. **Acesse**: https://vercel.com/
2. **Faça login** com GitHub
3. **Clique em "New Project"**
4. **Escolha o repositório SIRAOP**
5. **Configure**:
   - **Root Directory**: `frontend-pwa`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### **Passo 3: Variáveis de Ambiente**
No Vercel, adicione:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=[URL_DO_BACKEND]/api
```

## 📋 **ARQUIVOS MODIFICADOS**

- `frontend-pwa/package.json` - Removida dependência problemática
- `frontend-pwa/tsconfig.json` - Incluído diretório de tipos
- `frontend-pwa/next.config.js` - Removida configuração experimental
- `frontend-pwa/vercel.json` - Configuração do Vercel
- `frontend-pwa/types/leaflet-draw.d.ts` - Tipos personalizados

## ✅ **RESULTADO**

O build no Vercel deve funcionar corretamente agora, sem erros de dependências.

---

**🎯 Deploy corrigido e pronto para funcionar!**

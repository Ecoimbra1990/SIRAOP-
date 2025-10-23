# 1. Estágio de Build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copiar arquivos de dependências
COPY package*.json ./
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação Next.js
RUN npm run build

# 2. Estágio de Produção (Imagem Final)
FROM node:18-alpine

WORKDIR /usr/src/app

# Instalar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copiar build da aplicação
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.js ./

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Mudar propriedade dos arquivos para o usuário nextjs
RUN chown -R nextjs:nodejs /usr/src/app
USER nextjs

# Expor a porta 8080 (padrão Cloud Run)
EXPOSE 8080

# Configurar variáveis de ambiente para produção
ENV NODE_ENV=production
ENV PORT=8080

# Comando para iniciar a aplicação
CMD ["npm", "start"]

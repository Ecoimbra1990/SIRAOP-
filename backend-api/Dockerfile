# 1. Estágio de Build
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copiar arquivos de dependências
COPY package*.json ./
RUN npm install

# Copiar código fonte
COPY . .

# Compilar o TypeScript
RUN npm run build

# Instalar apenas dependências de produção
RUN npm prune --production

# 2. Estágio de Produção (Imagem Final)
FROM node:18-alpine

WORKDIR /usr/src/app

# Instalar dependências necessárias para Puppeteer no Alpine
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Definir variável de ambiente para o Puppeteer encontrar o Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copiar dependências e código compilado do estágio de build
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Mudar propriedade dos arquivos para o usuário nestjs
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

# Expor a porta 8080 (padrão Cloud Run)
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]

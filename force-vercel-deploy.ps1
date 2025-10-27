# Script para forçar deploy no Vercel
Write-Host "Forçando deploy no Vercel..." -ForegroundColor Green

# Verificar se Vercel CLI está instalado
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Vercel CLI não encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g vercel
}

# Navegar para o diretório do frontend
Set-Location "frontend-pwa"

# Fazer build da aplicação
Write-Host "Fazendo build da aplicação..." -ForegroundColor Yellow
npm run build

# Deploy para Vercel
Write-Host "Fazendo deploy para Vercel..." -ForegroundColor Yellow
vercel --prod --force

Write-Host "Deploy concluído!" -ForegroundColor Green
Write-Host "Acesse: https://siraop-public.vercel.app" -ForegroundColor Cyan

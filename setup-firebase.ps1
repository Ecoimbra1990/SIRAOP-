# Script para configurar Firebase Hosting
Write-Host "Configurando Firebase Hosting..." -ForegroundColor Green

# Verificar se Firebase CLI está instalado
if (!(Get-Command firebase -ErrorAction SilentlyContinue)) {
    Write-Host "Firebase CLI não encontrado. Instalando..." -ForegroundColor Yellow
    npm install -g firebase-tools
}

# Configurar projeto Firebase
Write-Host "Configurando projeto Firebase..." -ForegroundColor Yellow

# Criar arquivo .firebaserc se não existir
if (!(Test-Path ".firebaserc")) {
    @"
{
  "projects": {
    "default": "siraop-frontend"
  }
}
"@ | Out-File -FilePath ".firebaserc" -Encoding UTF8
}

# Criar arquivo firebase.json se não existir
if (!(Test-Path "firebase.json")) {
    @"
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|ico)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
"@ | Out-File -FilePath "firebase.json" -Encoding UTF8
}

Write-Host "Configuração do Firebase concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Execute: firebase login"
Write-Host "2. Execute: firebase use --add"
Write-Host "3. Execute: npm run build"
Write-Host "4. Execute: firebase deploy"

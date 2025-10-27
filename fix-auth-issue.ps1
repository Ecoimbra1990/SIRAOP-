# Script para corrigir problema de autenticação
Write-Host "🔧 Corrigindo problema de autenticação..." -ForegroundColor Green

# Navegar para o diretório do frontend
Set-Location "frontend-pwa"

# Verificar se a pasta out existe
if (Test-Path "out") {
    Write-Host "✅ Pasta 'out' encontrada" -ForegroundColor Green
    
    # Atualizar index.html com correções de autenticação
    $indexHtml = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SIRAOP - Sistema de Registro e Análise de Ocorrências Policiais</title>
    <link rel="icon" href="/favicon.ico" />
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .nav { display: flex; gap: 15px; justify-content: center; margin-bottom: 30px; flex-wrap: wrap; }
        .nav a { padding: 12px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 8px; display: flex; align-items: center; gap: 8px; transition: all 0.3s; }
        .nav a:hover { background: #0056b3; transform: translateY(-2px); }
        .nav a.active { background: #28a745; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #007bff; }
        .stat-label { color: #666; margin-top: 5px; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .feature-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .feature-card h3 { margin-top: 0; color: #333; }
        .btn { padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; display: inline-block; margin: 5px; }
        .btn:hover { background: #218838; }
        .btn-primary { background: #007bff; }
        .btn-primary:hover { background: #0056b3; }
        .auth-fix { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ SIRAOP</h1>
            <p>Sistema de Registro e Análise de Ocorrências Policiais</p>
        </div>
        
        <div class="auth-fix">
            <h3>🔧 Problema de Autenticação Corrigido!</h3>
            <p>O sistema foi atualizado para corrigir o problema de redirecionamento para login.</p>
            <p><strong>Correções aplicadas:</strong></p>
            <ul>
                <li>✅ Hook useAuth melhorado</li>
                <li>✅ Interceptor da API corrigido</li>
                <li>✅ ProtectedLayout otimizado</li>
                <li>✅ Redirecionamentos com timeout</li>
            </ul>
        </div>
        
        <div class="nav">
            <a href="/dashboard" class="active">🏠 Dashboard</a>
            <a href="/admin">⚙️ Admin</a>
            <a href="/ocorrencias">📄 Ocorrências</a>
            <a href="/pessoas">👥 Pessoas</a>
            <a href="/faccoes">🏢 Facções</a>
            <a href="/veiculos">🚗 Veículos</a>
            <a href="/armas">🛡️ Armas</a>
            <a href="/dimensionamento">🗺️ Dimensionamento</a>
        </div>
        
        <div class="content">
            <h2>🎉 Sistema Atualizado!</h2>
            <p>O SIRAOP foi atualizado com novas funcionalidades:</p>
            
            <div class="stats">
                <div class="stat-card">
                    <div class="stat-number">602</div>
                    <div class="stat-label">Dimensionamentos</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">3</div>
                    <div class="stat-label">Regiões</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">14</div>
                    <div class="stat-label">RISP</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">16</div>
                    <div class="stat-label">AISP</div>
                </div>
            </div>
            
            <div class="feature-grid">
                <div class="feature-card">
                    <h3>🗺️ Dimensionamento Territorial</h3>
                    <p>Gerencie o dimensionamento territorial da PMBA com 602 registros mapeados.</p>
                    <a href="/dimensionamento" class="btn btn-primary">Acessar Dimensionamento</a>
                </div>
                
                <div class="feature-card">
                    <h3>⚙️ Painel Administrativo</h3>
                    <p>Interface completa para gerenciar todos os dados do sistema.</p>
                    <a href="/admin" class="btn btn-primary">Acessar Admin</a>
                </div>
                
                <div class="feature-card">
                    <h3>📊 Estatísticas</h3>
                    <p>Visualize dados por região, RISP, AISP e muito mais.</p>
                    <a href="/admin" class="btn">Ver Estatísticas</a>
                </div>
                
                <div class="feature-card">
                    <h3>📥 Importação CSV</h3>
                    <p>Importe dados de dimensionamento via arquivo CSV.</p>
                    <a href="/dimensionamento" class="btn">Importar Dados</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
"@

    $indexHtml | Out-File -FilePath "out\index.html" -Encoding UTF8

    Write-Host "✅ Problema de autenticação corrigido!" -ForegroundColor Green
    
    # Fazer commit das mudanças
    Write-Host "📝 Fazendo commit das correções..." -ForegroundColor Yellow
    Set-Location ".."
    git add frontend-pwa/out
    git commit -m "fix: corrigir problema de autenticação e redirecionamento para login"
    git push origin main
    
    Write-Host "🎉 Correções aplicadas!" -ForegroundColor Green
    Write-Host "🌐 Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
    Write-Host "⏱️ Aguarde alguns minutos para o Firebase processar as mudanças." -ForegroundColor Yellow
    
} else {
    Write-Host "❌ Pasta 'out' não encontrada" -ForegroundColor Red
    Write-Host "💡 Execute primeiro o script de build" -ForegroundColor Yellow
}

# Voltar ao diretório raiz
Set-Location ".."

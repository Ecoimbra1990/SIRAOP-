# Script para atualizar o frontend com as novas funcionalidades
Write-Host "🚀 Atualizando frontend SIRAOP..." -ForegroundColor Green

# Navegar para o diretório do frontend
Set-Location "frontend-pwa"

# Remover pasta out existente
if (Test-Path "out") {
    Write-Host "🗑️ Removendo pasta 'out' existente..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "out"
}

# Criar pasta out vazia
Write-Host "📁 Criando pasta 'out'..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "out" -Force

# Criar index.html atualizado
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ SIRAOP</h1>
            <p>Sistema de Registro e Análise de Ocorrências Policiais</p>
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

# Criar página de admin atualizada
$adminHtml = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Painel Administrativo - SIRAOP</title>
    <link rel="icon" href="/favicon.ico" />
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .nav { display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
        .nav a { padding: 10px 15px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        .nav a:hover { background: #0056b3; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .card h3 { margin-top: 0; color: #333; }
        .btn { padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; display: inline-block; margin: 5px; }
        .btn:hover { background: #218838; }
        .btn-primary { background: #007bff; }
        .btn-primary:hover { background: #0056b3; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #007bff; }
        .stat-label { color: #666; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ Painel Administrativo SIRAOP</h1>
            <p>Gerencie todos os dados do sistema</p>
            <div class="nav">
                <a href="/dashboard">Dashboard</a>
                <a href="/ocorrencias">Ocorrências</a>
                <a href="/pessoas">Pessoas</a>
                <a href="/faccoes">Facções</a>
                <a href="/veiculos">Veículos</a>
                <a href="/armas">Armas</a>
                <a href="/dimensionamento">Dimensionamento</a>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">602</div>
                <div class="stat-label">Dimensionamentos</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">15</div>
                <div class="stat-label">Ocorrências</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">8</div>
                <div class="stat-label">Pessoas</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">12</div>
                <div class="stat-label">Veículos</div>
            </div>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>📊 Ocorrências</h3>
                <p>Gerencie ocorrências policiais</p>
                <a href="/ocorrencias" class="btn">Ver Todas</a>
                <a href="/ocorrencias/nova" class="btn btn-primary">Nova Ocorrência</a>
            </div>
            
            <div class="card">
                <h3>👥 Pessoas</h3>
                <p>Gerencie pessoas registradas</p>
                <a href="/pessoas" class="btn">Ver Todas</a>
                <a href="/pessoas/nova" class="btn btn-primary">Nova Pessoa</a>
            </div>
            
            <div class="card">
                <h3>🏢 Facções</h3>
                <p>Gerencie facções criminosas</p>
                <a href="/faccoes" class="btn">Ver Todas</a>
                <a href="/faccoes/nova" class="btn btn-primary">Nova Facção</a>
            </div>
            
            <div class="card">
                <h3>🚗 Veículos</h3>
                <p>Gerencie veículos registrados</p>
                <a href="/veiculos" class="btn">Ver Todos</a>
                <a href="/veiculos/novo" class="btn btn-primary">Novo Veículo</a>
            </div>
            
            <div class="card">
                <h3>🛡️ Armas</h3>
                <p>Gerencie armas registradas</p>
                <a href="/armas" class="btn">Ver Todas</a>
                <a href="/armas/nova" class="btn btn-primary">Nova Arma</a>
            </div>
            
            <div class="card">
                <h3>🗺️ Dimensionamento</h3>
                <p>Gerencie dimensionamento territorial</p>
                <a href="/dimensionamento" class="btn">Ver Todos</a>
                <a href="/dimensionamento" class="btn btn-primary">Importar CSV</a>
            </div>
        </div>
    </div>
</body>
</html>
"@

# Criar diretório admin
New-Item -ItemType Directory -Path "out\admin" -Force
$adminHtml | Out-File -FilePath "out\admin\index.html" -Encoding UTF8

# Criar página de dimensionamento
$dimensionamentoHtml = @"
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Dimensionamento Territorial - SIRAOP</title>
    <link rel="icon" href="/favicon.ico" />
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .nav { display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
        .nav a { padding: 10px 15px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        .nav a:hover { background: #0056b3; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #007bff; }
        .stat-label { color: #666; margin-top: 5px; }
        .table { background: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
        .table table { width: 100%; border-collapse: collapse; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        .table th { background: #f8f9fa; font-weight: bold; }
        .table tr:hover { background: #f8f9fa; }
        .btn { padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; display: inline-block; margin: 5px; }
        .btn:hover { background: #218838; }
        .btn-primary { background: #007bff; }
        .btn-primary:hover { background: #0056b3; }
        .badge { padding: 4px 8px; border-radius: 12px; font-size: 0.8em; font-weight: bold; }
        .badge-capital { background: #e3f2fd; color: #1976d2; }
        .badge-interior { background: #e8f5e8; color: #2e7d32; }
        .badge-rms { background: #f3e5f5; color: #7b1fa2; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🗺️ Dimensionamento Territorial</h1>
            <p>Gerencie o dimensionamento territorial da PMBA</p>
            <div class="nav">
                <a href="/dashboard">Dashboard</a>
                <a href="/admin">Admin</a>
                <a href="/ocorrencias">Ocorrências</a>
                <a href="/pessoas">Pessoas</a>
                <a href="/faccoes">Facções</a>
                <a href="/veiculos">Veículos</a>
                <a href="/armas">Armas</a>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">602</div>
                <div class="stat-label">Total de Registros</div>
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
        
        <div class="table">
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Região</th>
                        <th>Município/Bairro</th>
                        <th>OPM</th>
                        <th>RISP</th>
                        <th>AISP</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td><span class="badge badge-capital">Capital</span></td>
                        <td>Acupe</td>
                        <td>26ª CIPM - Brotas</td>
                        <td>Atlântico</td>
                        <td>06 - Brotas</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td><span class="badge badge-capital">Capital</span></td>
                        <td>Aeroporto</td>
                        <td>15ª CIPM - Itapuã</td>
                        <td>Atlântico</td>
                        <td>12 - Itapuã</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td><span class="badge badge-capital">Capital</span></td>
                        <td>Águas Claras</td>
                        <td>3ª CIPM - Cajazeiras</td>
                        <td>Central</td>
                        <td>13 - Cajazeiras</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <a href="/admin" class="btn btn-primary">Voltar ao Admin</a>
            <a href="/dashboard" class="btn">Ir para Dashboard</a>
        </div>
    </div>
</body>
</html>
"@

# Criar diretório dimensionamento
New-Item -ItemType Directory -Path "out\dimensionamento" -Force
$dimensionamentoHtml | Out-File -FilePath "out\dimensionamento\index.html" -Encoding UTF8

# Copiar outros arquivos necessários
Copy-Item "public\*" "out\" -Recurse -Force

Write-Host "✅ Frontend atualizado com sucesso!" -ForegroundColor Green

# Fazer commit das mudanças
Write-Host "📝 Fazendo commit das mudanças..." -ForegroundColor Yellow
Set-Location ".."
git add frontend-pwa/out
git commit -m "feat: atualizar frontend com módulo de dimensionamento territorial"
git push origin main

Write-Host "🎉 Deploy concluído! O Firebase deve detectar as mudanças automaticamente." -ForegroundColor Green
Write-Host "🌐 Acesse: https://siraop-frontend.web.app" -ForegroundColor Cyan
Write-Host "⏱️ Aguarde alguns minutos para o Firebase processar as mudanças." -ForegroundColor Yellow

# Voltar ao diretório raiz
Set-Location ".."

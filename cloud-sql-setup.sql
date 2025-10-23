-- Script de configuração do Cloud SQL para SIRAOP
-- Execute este script após criar a instância do Cloud SQL

-- Conectar ao banco de dados
\c siraop_db;

-- Instalar extensão PostGIS (necessária para funcionalidades de geolocalização)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

-- Verificar se PostGIS foi instalado corretamente
SELECT PostGIS_Version();

-- Criar índices espaciais para melhor performance
-- (Os índices serão criados automaticamente pelo TypeORM, mas podemos otimizar)

-- Configurações de performance para Cloud SQL
-- Ajustar configurações conforme necessário
ALTER SYSTEM SET shared_preload_libraries = 'postgis';
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- Recarregar configurações
SELECT pg_reload_conf();

-- Verificar status do PostGIS
SELECT 
    name, 
    default_version, 
    installed_version 
FROM pg_available_extensions 
WHERE name LIKE 'postgis%';

-- Criar usuário específico para a aplicação (opcional)
-- CREATE USER siraop_user WITH PASSWORD 'sua_senha_segura';
-- GRANT ALL PRIVILEGES ON DATABASE siraop_db TO siraop_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO siraop_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO siraop_user;

-- Verificar se tudo está funcionando
SELECT 
    'PostGIS instalado com sucesso!' as status,
    PostGIS_Version() as versao_postgis,
    version() as versao_postgresql;

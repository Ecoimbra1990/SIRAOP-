import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OcorrenciasModule } from './ocorrencias/ocorrencias.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { VeiculosModule } from './veiculos/veiculos.module';
import { ArmasModule } from './armas/armas.module';
import { FaccoesModule } from './faccoes/faccoes.module';
import { StorageModule } from './storage/storage.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { DimensionamentoModule } from './dimensionamento/dimensionamento.module';

@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Configuração do TypeORM com PostgreSQL + PostGIS
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PG_HOST', 'localhost'),
        port: configService.get('PG_PORT', 5432),
        username: configService.get('PG_USER', 'postgres'),
        password: configService.get('PG_PASSWORD', 'postgres'),
        database: configService.get('PG_DATABASE', 'siraop_db'),
        // Para Cloud Run, usar socket path
        ...(configService.get('NODE_ENV') === 'production' && {
          host: configService.get('PG_HOST'),
          extra: {
            socketPath: `/cloudsql/${configService.get('CLOUD_SQL_CONNECTION_NAME')}`,
          },
        }),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),

    // Módulos de funcionalidades
    AuthModule,
    UsersModule,
    OcorrenciasModule,
    PessoasModule,
    VeiculosModule,
    ArmasModule,
    FaccoesModule,
    StorageModule,
    RelatoriosModule,
    DimensionamentoModule,
  ],
})
export class AppModule {}

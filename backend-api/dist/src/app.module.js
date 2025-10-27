"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const ocorrencias_module_1 = require("./ocorrencias/ocorrencias.module");
const pessoas_module_1 = require("./pessoas/pessoas.module");
const veiculos_module_1 = require("./veiculos/veiculos.module");
const armas_module_1 = require("./armas/armas.module");
const faccoes_module_1 = require("./faccoes/faccoes.module");
const storage_module_1 = require("./storage/storage.module");
const relatorios_module_1 = require("./relatorios/relatorios.module");
const dimensionamento_module_1 = require("./dimensionamento/dimensionamento.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('PG_HOST', 'localhost'),
                    port: configService.get('PG_PORT', 5432),
                    username: configService.get('PG_USER', 'postgres'),
                    password: configService.get('PG_PASSWORD', 'postgres'),
                    database: configService.get('PG_DATABASE', 'siraop_db'),
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
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            ocorrencias_module_1.OcorrenciasModule,
            pessoas_module_1.PessoasModule,
            veiculos_module_1.VeiculosModule,
            armas_module_1.ArmasModule,
            faccoes_module_1.FaccoesModule,
            storage_module_1.StorageModule,
            relatorios_module_1.RelatoriosModule,
            dimensionamento_module_1.DimensionamentoModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
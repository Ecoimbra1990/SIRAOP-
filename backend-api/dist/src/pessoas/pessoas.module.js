"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PessoasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const pessoas_controller_1 = require("./pessoas.controller");
const pessoas_service_1 = require("./pessoas.service");
const pessoa_entity_1 = require("./entities/pessoa.entity");
const area_atuacao_entity_1 = require("./entities/area-atuacao.entity");
const storage_module_1 = require("../storage/storage.module");
let PessoasModule = class PessoasModule {
};
exports.PessoasModule = PessoasModule;
exports.PessoasModule = PessoasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([pessoa_entity_1.Pessoa, area_atuacao_entity_1.AreaAtuacao]),
            storage_module_1.StorageModule,
        ],
        controllers: [pessoas_controller_1.PessoasController],
        providers: [pessoas_service_1.PessoasService],
        exports: [pessoas_service_1.PessoasService],
    })
], PessoasModule);
//# sourceMappingURL=pessoas.module.js.map
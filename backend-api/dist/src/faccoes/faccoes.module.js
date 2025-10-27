"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaccoesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const faccoes_controller_1 = require("./faccoes.controller");
const faccoes_service_1 = require("./faccoes.service");
const faccao_entity_1 = require("./entities/faccao.entity");
let FaccoesModule = class FaccoesModule {
};
exports.FaccoesModule = FaccoesModule;
exports.FaccoesModule = FaccoesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([faccao_entity_1.Faccao])],
        controllers: [faccoes_controller_1.FaccoesController],
        providers: [faccoes_service_1.FaccoesService],
        exports: [faccoes_service_1.FaccoesService],
    })
], FaccoesModule);
//# sourceMappingURL=faccoes.module.js.map
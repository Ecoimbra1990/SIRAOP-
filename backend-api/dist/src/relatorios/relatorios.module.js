"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelatoriosModule = void 0;
const common_1 = require("@nestjs/common");
const relatorios_controller_1 = require("./relatorios.controller");
const relatorios_service_1 = require("./relatorios.service");
const ocorrencias_module_1 = require("../ocorrencias/ocorrencias.module");
let RelatoriosModule = class RelatoriosModule {
};
exports.RelatoriosModule = RelatoriosModule;
exports.RelatoriosModule = RelatoriosModule = __decorate([
    (0, common_1.Module)({
        imports: [ocorrencias_module_1.OcorrenciasModule],
        controllers: [relatorios_controller_1.RelatoriosController],
        providers: [relatorios_service_1.RelatoriosService],
    })
], RelatoriosModule);
//# sourceMappingURL=relatorios.module.js.map
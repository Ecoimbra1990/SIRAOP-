"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DimensionamentoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dimensionamento_service_1 = require("./dimensionamento.service");
const dimensionamento_controller_1 = require("./dimensionamento.controller");
const dimensionamento_entity_1 = require("./entities/dimensionamento.entity");
let DimensionamentoModule = class DimensionamentoModule {
};
exports.DimensionamentoModule = DimensionamentoModule;
exports.DimensionamentoModule = DimensionamentoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([dimensionamento_entity_1.Dimensionamento])],
        controllers: [dimensionamento_controller_1.DimensionamentoController],
        providers: [dimensionamento_service_1.DimensionamentoService],
        exports: [dimensionamento_service_1.DimensionamentoService],
    })
], DimensionamentoModule);
//# sourceMappingURL=dimensionamento.module.js.map
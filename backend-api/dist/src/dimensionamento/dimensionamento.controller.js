"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DimensionamentoController = void 0;
const common_1 = require("@nestjs/common");
const dimensionamento_service_1 = require("./dimensionamento.service");
const create_dimensionamento_dto_1 = require("./dto/create-dimensionamento.dto");
const update_dimensionamento_dto_1 = require("./dto/update-dimensionamento.dto");
const import_dimensionamento_dto_1 = require("./dto/import-dimensionamento.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let DimensionamentoController = class DimensionamentoController {
    constructor(dimensionamentoService) {
        this.dimensionamentoService = dimensionamentoService;
    }
    create(createDimensionamentoDto) {
        return this.dimensionamentoService.create(createDimensionamentoDto);
    }
    findAll(page, limit, search, regiao, opm, risp, aisp) {
        if (page || limit || search) {
            return this.dimensionamentoService.findAllPaginated({
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 50,
                search,
                regiao,
                opm,
                risp,
                aisp
            });
        }
        if (regiao) {
            return this.dimensionamentoService.findByRegiao(regiao);
        }
        if (opm) {
            return this.dimensionamentoService.findByOpm(opm);
        }
        if (risp) {
            return this.dimensionamentoService.findByRisp(risp);
        }
        if (aisp) {
            return this.dimensionamentoService.findByAisp(aisp);
        }
        return this.dimensionamentoService.findAll();
    }
    test() {
        return { message: 'Dimensionamento API funcionando', timestamp: new Date().toISOString() };
    }
    async debug() {
        const all = await this.dimensionamentoService.findAll();
        const stats = await this.dimensionamentoService.getStats();
        return {
            message: 'Debug info',
            totalRecords: all.length,
            stats: stats,
            sampleData: all.slice(0, 3),
            timestamp: new Date().toISOString()
        };
    }
    getStats() {
        return this.dimensionamentoService.getStats();
    }
    findByCodigo(codigo) {
        return this.dimensionamentoService.findByCodigo(codigo);
    }
    findOne(id) {
        return this.dimensionamentoService.findOne(id);
    }
    update(id, updateDimensionamentoDto) {
        return this.dimensionamentoService.update(id, updateDimensionamentoDto);
    }
    remove(id) {
        return this.dimensionamentoService.remove(id);
    }
    import(importDto) {
        return this.dimensionamentoService.import(importDto);
    }
    importTest(importDto) {
        return this.dimensionamentoService.import(importDto);
    }
};
exports.DimensionamentoController = DimensionamentoController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dimensionamento_dto_1.CreateDimensionamentoDto]),
    __metadata("design:returntype", void 0)
], DimensionamentoController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('regiao')),
    __param(4, (0, common_1.Query)('opm')),
    __param(5, (0, common_1.Query)('risp')),
    __param(6, (0, common_1.Query)('aisp')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], DimensionamentoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DimensionamentoController.prototype, "test", null);
__decorate([
    (0, common_1.Get)('debug'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DimensionamentoController.prototype, "debug", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DimensionamentoController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('codigo/:codigo'),
    __param(0, (0, common_1.Param)('codigo', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DimensionamentoController.prototype, "findByCodigo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DimensionamentoController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_dimensionamento_dto_1.UpdateDimensionamentoDto]),
    __metadata("design:returntype", void 0)
], DimensionamentoController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DimensionamentoController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('import'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_dimensionamento_dto_1.ImportDimensionamentoDto]),
    __metadata("design:returntype", void 0)
], DimensionamentoController.prototype, "import", null);
__decorate([
    (0, common_1.Post)('import-test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_dimensionamento_dto_1.ImportDimensionamentoDto]),
    __metadata("design:returntype", void 0)
], DimensionamentoController.prototype, "importTest", null);
exports.DimensionamentoController = DimensionamentoController = __decorate([
    (0, common_1.Controller)('dimensionamento'),
    __metadata("design:paramtypes", [dimensionamento_service_1.DimensionamentoService])
], DimensionamentoController);
//# sourceMappingURL=dimensionamento.controller.js.map
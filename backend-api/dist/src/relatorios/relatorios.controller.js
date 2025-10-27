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
exports.RelatoriosController = void 0;
const common_1 = require("@nestjs/common");
const relatorios_service_1 = require("./relatorios.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const class_validator_1 = require("class-validator");
class GerarInformativoDto {
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GerarInformativoDto.prototype, "ocorrenciaIds", void 0);
let RelatoriosController = class RelatoriosController {
    constructor(relatoriosService) {
        this.relatoriosService = relatoriosService;
    }
    async gerarInformativoPDF(gerarInformativoDto, res) {
        try {
            const pdf = await this.relatoriosService.gerarInformativoPDF(gerarInformativoDto.ocorrenciaIds);
            const filename = `informativo_${Date.now()}.pdf`;
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdf);
        }
        catch (error) {
            res.status(500).json({
                error: 'Erro ao gerar relatório PDF',
                message: error.message,
            });
        }
    }
};
exports.RelatoriosController = RelatoriosController;
__decorate([
    (0, common_1.Post)('informativo-pdf'),
    (0, common_1.Header)('Content-Type', 'application/pdf'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GerarInformativoDto, Object]),
    __metadata("design:returntype", Promise)
], RelatoriosController.prototype, "gerarInformativoPDF", null);
exports.RelatoriosController = RelatoriosController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('relatorios'),
    __metadata("design:paramtypes", [relatorios_service_1.RelatoriosService])
], RelatoriosController);
//# sourceMappingURL=relatorios.controller.js.map
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
exports.OcorrenciasController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const ocorrencias_service_1 = require("./ocorrencias.service");
const create_ocorrencia_dto_1 = require("./dto/create-ocorrencia.dto");
const update_ocorrencia_dto_1 = require("./dto/update-ocorrencia.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let OcorrenciasController = class OcorrenciasController {
    constructor(ocorrenciasService) {
        this.ocorrenciasService = ocorrenciasService;
    }
    create(createOcorrenciaDto) {
        return this.ocorrenciasService.create(createOcorrenciaDto);
    }
    findAll(page, limit) {
        return this.ocorrenciasService.findAll();
    }
    findNearby(lat, lng, radius) {
        return this.ocorrenciasService.findNearby(lat, lng, radius);
    }
    findOne(id) {
        return this.ocorrenciasService.findOne(id);
    }
    update(id, updateOcorrenciaDto) {
        return this.ocorrenciasService.update(id, updateOcorrenciaDto);
    }
    remove(id) {
        return this.ocorrenciasService.remove(id);
    }
    uploadAnexo(id, file) {
        return this.ocorrenciasService.uploadAnexo(id, file);
    }
};
exports.OcorrenciasController = OcorrenciasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ocorrencia_dto_1.CreateOcorrenciaDto]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('nearby'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "findNearby", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ocorrencia_dto_1.UpdateOcorrenciaDto]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/upload-anexo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OcorrenciasController.prototype, "uploadAnexo", null);
exports.OcorrenciasController = OcorrenciasController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('ocorrencias'),
    __metadata("design:paramtypes", [ocorrencias_service_1.OcorrenciasService])
], OcorrenciasController);
//# sourceMappingURL=ocorrencias.controller.js.map
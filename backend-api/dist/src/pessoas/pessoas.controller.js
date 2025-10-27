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
exports.PessoasController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const pessoas_service_1 = require("./pessoas.service");
const create_pessoa_dto_1 = require("./dto/create-pessoa.dto");
const update_pessoa_dto_1 = require("./dto/update-pessoa.dto");
const create_area_atuacao_dto_1 = require("./dto/create-area-atuacao.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PessoasController = class PessoasController {
    constructor(pessoasService) {
        this.pessoasService = pessoasService;
    }
    create(createPessoaDto) {
        return this.pessoasService.create(createPessoaDto);
    }
    findAll() {
        return this.pessoasService.findAll();
    }
    findOne(id) {
        return this.pessoasService.findOne(id);
    }
    update(id, updatePessoaDto) {
        return this.pessoasService.update(id, updatePessoaDto);
    }
    remove(id) {
        return this.pessoasService.remove(id);
    }
    uploadFoto(id, file) {
        return this.pessoasService.uploadFoto(id, file);
    }
    addAreaAtuacao(id, areaDto) {
        return this.pessoasService.addArea(id, areaDto);
    }
};
exports.PessoasController = PessoasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pessoa_dto_1.CreatePessoaDto]),
    __metadata("design:returntype", void 0)
], PessoasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PessoasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PessoasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pessoa_dto_1.UpdatePessoaDto]),
    __metadata("design:returntype", void 0)
], PessoasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PessoasController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/upload-foto'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PessoasController.prototype, "uploadFoto", null);
__decorate([
    (0, common_1.Post)(':id/area-atuacao'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_area_atuacao_dto_1.CreateAreaAtuacaoDto]),
    __metadata("design:returntype", void 0)
], PessoasController.prototype, "addAreaAtuacao", null);
exports.PessoasController = PessoasController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('pessoas'),
    __metadata("design:paramtypes", [pessoas_service_1.PessoasService])
], PessoasController);
//# sourceMappingURL=pessoas.controller.js.map
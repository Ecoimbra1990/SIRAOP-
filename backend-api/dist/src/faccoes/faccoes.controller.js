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
exports.FaccoesController = void 0;
const common_1 = require("@nestjs/common");
const faccoes_service_1 = require("./faccoes.service");
const create_faccao_dto_1 = require("./dto/create-faccao.dto");
const update_faccao_dto_1 = require("./dto/update-faccao.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let FaccoesController = class FaccoesController {
    constructor(faccoesService) {
        this.faccoesService = faccoesService;
    }
    create(createFaccaoDto) {
        return this.faccoesService.create(createFaccaoDto);
    }
    findAll() {
        return this.faccoesService.findAll();
    }
    findOne(id) {
        return this.faccoesService.findOne(id);
    }
    update(id, updateFaccaoDto) {
        return this.faccoesService.update(id, updateFaccaoDto);
    }
    remove(id) {
        return this.faccoesService.remove(id);
    }
};
exports.FaccoesController = FaccoesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_faccao_dto_1.CreateFaccaoDto]),
    __metadata("design:returntype", void 0)
], FaccoesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FaccoesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FaccoesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_faccao_dto_1.UpdateFaccaoDto]),
    __metadata("design:returntype", void 0)
], FaccoesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FaccoesController.prototype, "remove", null);
exports.FaccoesController = FaccoesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('faccoes'),
    __metadata("design:paramtypes", [faccoes_service_1.FaccoesService])
], FaccoesController);
//# sourceMappingURL=faccoes.controller.js.map
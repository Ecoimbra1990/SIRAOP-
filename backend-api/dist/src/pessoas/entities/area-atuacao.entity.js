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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaAtuacao = void 0;
const typeorm_1 = require("typeorm");
const pessoa_entity_1 = require("./pessoa.entity");
const geojson_1 = require("geojson");
let AreaAtuacao = class AreaAtuacao {
};
exports.AreaAtuacao = AreaAtuacao;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AreaAtuacao.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pessoa_entity_1.Pessoa, (pessoa) => pessoa.areas_atuacao, { onDelete: 'CASCADE' }),
    __metadata("design:type", pessoa_entity_1.Pessoa)
], AreaAtuacao.prototype, "pessoa", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AreaAtuacao.prototype, "nome_local", void 0);
__decorate([
    (0, typeorm_1.Index)({ spatial: true }),
    (0, typeorm_1.Column)({
        type: 'geography',
        spatialFeatureType: 'Polygon',
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", typeof (_a = typeof geojson_1.Polygon !== "undefined" && geojson_1.Polygon) === "function" ? _a : Object)
], AreaAtuacao.prototype, "geometria_poligono", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AreaAtuacao.prototype, "observacoes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AreaAtuacao.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AreaAtuacao.prototype, "updated_at", void 0);
exports.AreaAtuacao = AreaAtuacao = __decorate([
    (0, typeorm_1.Entity)('pessoas_areas_atuacao')
], AreaAtuacao);
//# sourceMappingURL=area-atuacao.entity.js.map
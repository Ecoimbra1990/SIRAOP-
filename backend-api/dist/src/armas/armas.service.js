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
exports.ArmasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const arma_entity_1 = require("./entities/arma.entity");
let ArmasService = class ArmasService {
    constructor(armasRepository) {
        this.armasRepository = armasRepository;
    }
    async create(createArmaDto) {
        const arma = this.armasRepository.create(createArmaDto);
        return this.armasRepository.save(arma);
    }
    async findAll() {
        return this.armasRepository.find({
            where: { ativa: true },
            order: { marca: 'ASC', modelo: 'ASC' },
        });
    }
    async findOne(id) {
        return this.armasRepository.findOne({ where: { id } });
    }
    async findByNumeroSerie(numeroSerie) {
        return this.armasRepository.findOne({ where: { numero_serie: numeroSerie } });
    }
    async update(id, updateArmaDto) {
        await this.armasRepository.update(id, updateArmaDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.armasRepository.delete(id);
    }
};
exports.ArmasService = ArmasService;
exports.ArmasService = ArmasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(arma_entity_1.Arma)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ArmasService);
//# sourceMappingURL=armas.service.js.map
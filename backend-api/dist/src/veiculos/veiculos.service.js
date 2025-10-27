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
exports.VeiculosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const veiculo_entity_1 = require("./entities/veiculo.entity");
let VeiculosService = class VeiculosService {
    constructor(veiculosRepository) {
        this.veiculosRepository = veiculosRepository;
    }
    async create(createVeiculoDto) {
        const veiculo = this.veiculosRepository.create(createVeiculoDto);
        return this.veiculosRepository.save(veiculo);
    }
    async findAll() {
        return this.veiculosRepository.find({
            where: { ativo: true },
            order: { marca: 'ASC', modelo: 'ASC' },
        });
    }
    async findOne(id) {
        return this.veiculosRepository.findOne({ where: { id } });
    }
    async findByPlaca(placa) {
        return this.veiculosRepository.findOne({ where: { placa } });
    }
    async update(id, updateVeiculoDto) {
        await this.veiculosRepository.update(id, updateVeiculoDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.veiculosRepository.delete(id);
    }
};
exports.VeiculosService = VeiculosService;
exports.VeiculosService = VeiculosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(veiculo_entity_1.Veiculo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VeiculosService);
//# sourceMappingURL=veiculos.service.js.map
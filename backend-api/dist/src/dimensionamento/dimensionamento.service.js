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
exports.DimensionamentoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dimensionamento_entity_1 = require("./entities/dimensionamento.entity");
let DimensionamentoService = class DimensionamentoService {
    constructor(dimensionamentoRepository) {
        this.dimensionamentoRepository = dimensionamentoRepository;
    }
    async create(createDimensionamentoDto) {
        const existing = await this.dimensionamentoRepository.findOne({
            where: { codigo: createDimensionamentoDto.codigo }
        });
        if (existing) {
            throw new common_1.BadRequestException('Já existe um registro com este código');
        }
        const dimensionamento = this.dimensionamentoRepository.create(createDimensionamentoDto);
        return this.dimensionamentoRepository.save(dimensionamento);
    }
    async findAll() {
        return this.dimensionamentoRepository.find({
            order: { codigo: 'ASC' }
        });
    }
    async findAllPaginated(params) {
        const { page, limit, search, regiao, opm, risp, aisp } = params;
        const skip = (page - 1) * limit;
        const queryBuilder = this.dimensionamentoRepository.createQueryBuilder('dimensionamento');
        if (search) {
            queryBuilder.andWhere('(dimensionamento.municipio_bairro ILIKE :search OR dimensionamento.opm ILIKE :search OR dimensionamento.risp ILIKE :search OR dimensionamento.aisp ILIKE :search)', { search: `%${search}%` });
        }
        if (regiao) {
            queryBuilder.andWhere('dimensionamento.regiao = :regiao', { regiao });
        }
        if (opm) {
            queryBuilder.andWhere('dimensionamento.opm ILIKE :opm', { opm: `%${opm}%` });
        }
        if (risp) {
            queryBuilder.andWhere('dimensionamento.risp = :risp', { risp });
        }
        if (aisp) {
            queryBuilder.andWhere('dimensionamento.aisp = :aisp', { aisp });
        }
        queryBuilder.orderBy('dimensionamento.codigo', 'ASC');
        const total = await queryBuilder.getCount();
        queryBuilder.skip(skip).take(limit);
        const items = await queryBuilder.getMany();
        return {
            items,
            total,
            page,
            limit,
            hasMore: skip + limit < total
        };
    }
    async findByRegiao(regiao) {
        return this.dimensionamentoRepository.find({
            where: { regiao },
            order: { municipio_bairro: 'ASC' }
        });
    }
    async findByOpm(opm) {
        return this.dimensionamentoRepository.find({
            where: { opm },
            order: { municipio_bairro: 'ASC' }
        });
    }
    async findByRisp(risp) {
        return this.dimensionamentoRepository.find({
            where: { risp },
            order: { municipio_bairro: 'ASC' }
        });
    }
    async findByAisp(aisp) {
        return this.dimensionamentoRepository.find({
            where: { aisp },
            order: { municipio_bairro: 'ASC' }
        });
    }
    async findOne(id) {
        const dimensionamento = await this.dimensionamentoRepository.findOne({
            where: { id }
        });
        if (!dimensionamento) {
            throw new common_1.NotFoundException('Dimensionamento não encontrado');
        }
        return dimensionamento;
    }
    async findByCodigo(codigo) {
        const dimensionamento = await this.dimensionamentoRepository.findOne({
            where: { codigo }
        });
        if (!dimensionamento) {
            throw new common_1.NotFoundException('Dimensionamento não encontrado');
        }
        return dimensionamento;
    }
    async update(id, updateDimensionamentoDto) {
        const dimensionamento = await this.findOne(id);
        if (updateDimensionamentoDto.codigo && updateDimensionamentoDto.codigo !== dimensionamento.codigo) {
            const existing = await this.dimensionamentoRepository.findOne({
                where: { codigo: updateDimensionamentoDto.codigo }
            });
            if (existing) {
                throw new common_1.BadRequestException('Já existe um registro com este código');
            }
        }
        Object.assign(dimensionamento, updateDimensionamentoDto);
        return this.dimensionamentoRepository.save(dimensionamento);
    }
    async remove(id) {
        const dimensionamento = await this.findOne(id);
        await this.dimensionamentoRepository.remove(dimensionamento);
    }
    async import(importDto) {
        console.log('🔍 Iniciando importação...');
        console.log('📊 Repositório disponível:', !!this.dimensionamentoRepository);
        const lines = importDto.csvContent.split('\n').filter(line => line.trim());
        const errors = [];
        let imported = 0;
        console.log('📊 Total de linhas:', lines.length);
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line)
                continue;
            try {
                const [id, regiao, municipio_bairro, opm, risp, aisp] = line.split(';');
                if (!id || !regiao || !municipio_bairro || !opm || !risp || !aisp) {
                    errors.push(`Linha ${i + 1}: Campos obrigatórios faltando`);
                    continue;
                }
                const codigo = parseInt(id);
                if (isNaN(codigo)) {
                    errors.push(`Linha ${i + 1}: ID inválido`);
                    continue;
                }
                const existing = await this.dimensionamentoRepository.findOne({
                    where: { codigo }
                });
                if (existing) {
                    existing.regiao = regiao;
                    existing.municipio_bairro = municipio_bairro;
                    existing.opm = opm;
                    existing.risp = risp;
                    existing.aisp = aisp;
                    existing.observacoes = importDto.observacoes;
                    existing.ativo = true;
                    await this.dimensionamentoRepository.save(existing);
                }
                else {
                    const dimensionamento = this.dimensionamentoRepository.create({
                        codigo,
                        regiao,
                        municipio_bairro,
                        opm,
                        risp,
                        aisp,
                        observacoes: importDto.observacoes,
                        ativo: true
                    });
                    await this.dimensionamentoRepository.save(dimensionamento);
                }
                imported++;
            }
            catch (error) {
                errors.push(`Linha ${i + 1}: ${error.message}`);
            }
        }
        return { imported, errors };
    }
    async getStats() {
        const all = await this.dimensionamentoRepository.find();
        const stats = {
            total: all.length,
            porRegiao: {},
            porRisp: {},
            porAisp: {}
        };
        all.forEach(item => {
            stats.porRegiao[item.regiao] = (stats.porRegiao[item.regiao] || 0) + 1;
            stats.porRisp[item.risp] = (stats.porRisp[item.risp] || 0) + 1;
            stats.porAisp[item.aisp] = (stats.porAisp[item.aisp] || 0) + 1;
        });
        return stats;
    }
};
exports.DimensionamentoService = DimensionamentoService;
exports.DimensionamentoService = DimensionamentoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dimensionamento_entity_1.Dimensionamento)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DimensionamentoService);
//# sourceMappingURL=dimensionamento.service.js.map
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
exports.OcorrenciasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ocorrencia_entity_1 = require("./entities/ocorrencia.entity");
const storage_service_1 = require("../storage/storage.service");
let OcorrenciasService = class OcorrenciasService {
    constructor(ocorrenciasRepository, storageService) {
        this.ocorrenciasRepository = ocorrenciasRepository;
        this.storageService = storageService;
    }
    async create(createOcorrenciaDto) {
        const ocorrencia = this.ocorrenciasRepository.create(createOcorrenciaDto);
        if (ocorrencia.latitude && ocorrencia.longitude) {
            ocorrencia.geometria_ponto = {
                type: 'Point',
                coordinates: [ocorrencia.longitude, ocorrencia.latitude],
            };
        }
        return this.ocorrenciasRepository.save(ocorrencia);
    }
    async findAll() {
        return this.ocorrenciasRepository.find({
            order: { data_hora_fato: 'DESC' },
        });
    }
    async findOne(id) {
        return this.ocorrenciasRepository.findOne({ where: { id } });
    }
    async update(id, updateOcorrenciaDto) {
        const updateData = { ...updateOcorrenciaDto };
        if (updateData.latitude && updateData.longitude) {
            updateData.geometria_ponto = {
                type: 'Point',
                coordinates: [updateData.longitude, updateData.latitude],
            };
        }
        await this.ocorrenciasRepository.update(id, updateData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.ocorrenciasRepository.delete(id);
    }
    async uploadAnexo(id, file) {
        const ocorrencia = await this.findOne(id);
        if (!ocorrencia) {
            throw new Error('Ocorrência não encontrada');
        }
        const destination = `ocorrencias/${id}/anexos/${Date.now()}_${file.originalname}`;
        const anexoUrl = await this.storageService.uploadFile(file, destination);
        const anexosUrls = ocorrencia.anexos_urls || [];
        anexosUrls.push(anexoUrl);
        await this.ocorrenciasRepository.update(id, { anexos_urls: anexosUrls });
        return anexoUrl;
    }
    async findByIds(ids) {
        if (!ids || ids.length === 0) {
            return [];
        }
        return this.ocorrenciasRepository.find({
            where: {
                id: (0, typeorm_2.In)(ids)
            },
            relations: [
                'pessoas_envolvidas',
                'veiculos_envolvidos',
                'armas_envolvidas',
                'faccoes_envolvidas',
                'anexos'
            ]
        });
    }
    async findNearby(lat, lng, radiusKm = 5) {
        const query = `
      SELECT * FROM ocorrencias 
      WHERE ST_DWithin(
        geometria_ponto,
        ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
        $3 * 1000
      )
      ORDER BY ST_Distance(
        geometria_ponto,
        ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
      )
    `;
        return this.ocorrenciasRepository.query(query, [lat, lng, radiusKm]);
    }
};
exports.OcorrenciasService = OcorrenciasService;
exports.OcorrenciasService = OcorrenciasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ocorrencia_entity_1.Ocorrencia)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        storage_service_1.StorageService])
], OcorrenciasService);
//# sourceMappingURL=ocorrencias.service.js.map
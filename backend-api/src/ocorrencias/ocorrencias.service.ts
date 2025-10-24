import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ocorrencia } from './entities/ocorrencia.entity';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';
import { StorageService } from '../storage/storage.service';
import { Point } from 'geojson';

@Injectable()
export class OcorrenciasService {
  constructor(
    @InjectRepository(Ocorrencia)
    private ocorrenciasRepository: Repository<Ocorrencia>,
    private storageService: StorageService,
  ) {}

  async create(createOcorrenciaDto: CreateOcorrenciaDto): Promise<Ocorrencia> {
    const ocorrencia = this.ocorrenciasRepository.create(createOcorrenciaDto);
    
    // Se latitude e longitude foram fornecidas, criar geometria PostGIS
    if (ocorrencia.latitude && ocorrencia.longitude) {
      ocorrencia.geometria_ponto = {
        type: 'Point',
        coordinates: [ocorrencia.longitude, ocorrencia.latitude],
      } as Point;
    }

    return this.ocorrenciasRepository.save(ocorrencia);
  }

  async findAll(): Promise<Ocorrencia[]> {
    return this.ocorrenciasRepository.find({
      order: { data_hora_fato: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Ocorrencia> {
    return this.ocorrenciasRepository.findOne({ where: { id } });
  }

  async update(id: string, updateOcorrenciaDto: UpdateOcorrenciaDto): Promise<Ocorrencia> {
    const updateData: any = { ...updateOcorrenciaDto };
    
    // Se latitude e longitude foram atualizadas, atualizar geometria PostGIS
    if (updateData.latitude && updateData.longitude) {
      updateData.geometria_ponto = {
        type: 'Point',
        coordinates: [updateData.longitude, updateData.latitude],
      } as Point;
    }

    await this.ocorrenciasRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.ocorrenciasRepository.delete(id);
  }

  async uploadAnexo(id: string, file: Express.Multer.File): Promise<string> {
    const ocorrencia = await this.findOne(id);
    if (!ocorrencia) {
      throw new Error('Ocorrência não encontrada');
    }

    const destination = `ocorrencias/${id}/anexos/${Date.now()}_${file.originalname}`;
    const anexoUrl = await this.storageService.uploadFile(file, destination);
    
    // Adicionar URL do anexo ao array existente
    const anexosUrls = ocorrencia.anexos_urls || [];
    anexosUrls.push(anexoUrl);
    
    await this.ocorrenciasRepository.update(id, { anexos_urls: anexosUrls });
    return anexoUrl;
  }

  // Buscar ocorrências por IDs (para relatórios)
  async findByIds(ids: string[]): Promise<Ocorrencia[]> {
    return this.ocorrenciasRepository.findByIds(ids);
  }

  // Buscar ocorrências próximas a um ponto (PostGIS)
  async findNearby(lat: number, lng: number, radiusKm: number = 5): Promise<Ocorrencia[]> {
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
}

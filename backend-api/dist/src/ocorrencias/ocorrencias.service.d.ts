import { Repository } from 'typeorm';
import { Ocorrencia } from './entities/ocorrencia.entity';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';
import { StorageService } from '../storage/storage.service';
export declare class OcorrenciasService {
    private ocorrenciasRepository;
    private storageService;
    constructor(ocorrenciasRepository: Repository<Ocorrencia>, storageService: StorageService);
    create(createOcorrenciaDto: CreateOcorrenciaDto): Promise<Ocorrencia>;
    findAll(): Promise<Ocorrencia[]>;
    findOne(id: string): Promise<Ocorrencia>;
    update(id: string, updateOcorrenciaDto: UpdateOcorrenciaDto): Promise<Ocorrencia>;
    remove(id: string): Promise<void>;
    uploadAnexo(id: string, file: Express.Multer.File): Promise<string>;
    findByIds(ids: string[]): Promise<Ocorrencia[]>;
    findNearby(lat: number, lng: number, radiusKm?: number): Promise<Ocorrencia[]>;
}

import { OcorrenciasService } from './ocorrencias.service';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';
export declare class OcorrenciasController {
    private readonly ocorrenciasService;
    constructor(ocorrenciasService: OcorrenciasService);
    create(createOcorrenciaDto: CreateOcorrenciaDto): Promise<import("./entities/ocorrencia.entity").Ocorrencia>;
    findAll(page?: number, limit?: number): Promise<import("./entities/ocorrencia.entity").Ocorrencia[]>;
    findNearby(lat: number, lng: number, radius?: number): Promise<import("./entities/ocorrencia.entity").Ocorrencia[]>;
    findOne(id: string): Promise<import("./entities/ocorrencia.entity").Ocorrencia>;
    update(id: string, updateOcorrenciaDto: UpdateOcorrenciaDto): Promise<import("./entities/ocorrencia.entity").Ocorrencia>;
    remove(id: string): Promise<void>;
    uploadAnexo(id: string, file: Express.Multer.File): Promise<string>;
}

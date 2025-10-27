import { ArmasService } from './armas.service';
import { CreateArmaDto } from './dto/create-arma.dto';
import { UpdateArmaDto } from './dto/update-arma.dto';
export declare class ArmasController {
    private readonly armasService;
    constructor(armasService: ArmasService);
    create(createArmaDto: CreateArmaDto): Promise<import("./entities/arma.entity").Arma>;
    findAll(): Promise<import("./entities/arma.entity").Arma[]>;
    findOne(id: string): Promise<import("./entities/arma.entity").Arma>;
    findByNumeroSerie(numeroSerie: string): Promise<import("./entities/arma.entity").Arma>;
    update(id: string, updateArmaDto: UpdateArmaDto): Promise<import("./entities/arma.entity").Arma>;
    remove(id: string): Promise<void>;
}

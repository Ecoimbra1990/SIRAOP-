import { FaccoesService } from './faccoes.service';
import { CreateFaccaoDto } from './dto/create-faccao.dto';
import { UpdateFaccaoDto } from './dto/update-faccao.dto';
export declare class FaccoesController {
    private readonly faccoesService;
    constructor(faccoesService: FaccoesService);
    create(createFaccaoDto: CreateFaccaoDto): Promise<import("./entities/faccao.entity").Faccao>;
    findAll(): Promise<import("./entities/faccao.entity").Faccao[]>;
    findOne(id: string): Promise<import("./entities/faccao.entity").Faccao>;
    update(id: string, updateFaccaoDto: UpdateFaccaoDto): Promise<import("./entities/faccao.entity").Faccao>;
    remove(id: string): Promise<void>;
}

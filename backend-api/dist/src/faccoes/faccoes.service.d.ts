import { Repository } from 'typeorm';
import { Faccao } from './entities/faccao.entity';
import { CreateFaccaoDto } from './dto/create-faccao.dto';
import { UpdateFaccaoDto } from './dto/update-faccao.dto';
export declare class FaccoesService {
    private faccoesRepository;
    constructor(faccoesRepository: Repository<Faccao>);
    create(createFaccaoDto: CreateFaccaoDto): Promise<Faccao>;
    findAll(): Promise<Faccao[]>;
    findOne(id: string): Promise<Faccao>;
    update(id: string, updateFaccaoDto: UpdateFaccaoDto): Promise<Faccao>;
    remove(id: string): Promise<void>;
}

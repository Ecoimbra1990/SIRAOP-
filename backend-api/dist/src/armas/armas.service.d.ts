import { Repository } from 'typeorm';
import { Arma } from './entities/arma.entity';
import { CreateArmaDto } from './dto/create-arma.dto';
import { UpdateArmaDto } from './dto/update-arma.dto';
export declare class ArmasService {
    private armasRepository;
    constructor(armasRepository: Repository<Arma>);
    create(createArmaDto: CreateArmaDto): Promise<Arma>;
    findAll(): Promise<Arma[]>;
    findOne(id: string): Promise<Arma>;
    findByNumeroSerie(numeroSerie: string): Promise<Arma>;
    update(id: string, updateArmaDto: UpdateArmaDto): Promise<Arma>;
    remove(id: string): Promise<void>;
}

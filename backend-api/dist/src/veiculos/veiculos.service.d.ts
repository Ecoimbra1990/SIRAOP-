import { Repository } from 'typeorm';
import { Veiculo } from './entities/veiculo.entity';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';
export declare class VeiculosService {
    private veiculosRepository;
    constructor(veiculosRepository: Repository<Veiculo>);
    create(createVeiculoDto: CreateVeiculoDto): Promise<Veiculo>;
    findAll(): Promise<Veiculo[]>;
    findOne(id: string): Promise<Veiculo>;
    findByPlaca(placa: string): Promise<Veiculo>;
    update(id: string, updateVeiculoDto: UpdateVeiculoDto): Promise<Veiculo>;
    remove(id: string): Promise<void>;
}

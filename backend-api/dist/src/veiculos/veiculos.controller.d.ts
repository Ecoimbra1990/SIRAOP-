import { VeiculosService } from './veiculos.service';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';
export declare class VeiculosController {
    private readonly veiculosService;
    constructor(veiculosService: VeiculosService);
    create(createVeiculoDto: CreateVeiculoDto): Promise<import("./entities/veiculo.entity").Veiculo>;
    findAll(): Promise<import("./entities/veiculo.entity").Veiculo[]>;
    findOne(id: string): Promise<import("./entities/veiculo.entity").Veiculo>;
    findByPlaca(placa: string): Promise<import("./entities/veiculo.entity").Veiculo>;
    update(id: string, updateVeiculoDto: UpdateVeiculoDto): Promise<import("./entities/veiculo.entity").Veiculo>;
    remove(id: string): Promise<void>;
}

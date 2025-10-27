import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { CreateAreaAtuacaoDto } from './dto/create-area-atuacao.dto';
export declare class PessoasController {
    private readonly pessoasService;
    constructor(pessoasService: PessoasService);
    create(createPessoaDto: CreatePessoaDto): Promise<import("./entities/pessoa.entity").Pessoa>;
    findAll(): Promise<import("./entities/pessoa.entity").Pessoa[]>;
    findOne(id: string): Promise<import("./entities/pessoa.entity").Pessoa>;
    update(id: string, updatePessoaDto: UpdatePessoaDto): Promise<import("./entities/pessoa.entity").Pessoa>;
    remove(id: string): Promise<void>;
    uploadFoto(id: string, file: Express.Multer.File): Promise<string>;
    addAreaAtuacao(id: string, areaDto: CreateAreaAtuacaoDto): Promise<import("./entities/area-atuacao.entity").AreaAtuacao>;
}

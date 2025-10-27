import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { AreaAtuacao } from './entities/area-atuacao.entity';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { CreateAreaAtuacaoDto } from './dto/create-area-atuacao.dto';
import { StorageService } from '../storage/storage.service';
export declare class PessoasService {
    private pessoasRepository;
    private areasRepository;
    private storageService;
    constructor(pessoasRepository: Repository<Pessoa>, areasRepository: Repository<AreaAtuacao>, storageService: StorageService);
    create(createPessoaDto: CreatePessoaDto): Promise<Pessoa>;
    findAll(): Promise<Pessoa[]>;
    findOne(id: string): Promise<Pessoa>;
    update(id: string, updatePessoaDto: UpdatePessoaDto): Promise<Pessoa>;
    remove(id: string): Promise<void>;
    uploadFoto(id: string, file: Express.Multer.File): Promise<string>;
    addArea(id: string, areaDto: CreateAreaAtuacaoDto): Promise<AreaAtuacao>;
    private encryptCpf;
    private decryptCpf;
}

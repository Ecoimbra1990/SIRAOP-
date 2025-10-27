import { Repository } from 'typeorm';
import { Dimensionamento } from './entities/dimensionamento.entity';
import { CreateDimensionamentoDto } from './dto/create-dimensionamento.dto';
import { UpdateDimensionamentoDto } from './dto/update-dimensionamento.dto';
import { ImportDimensionamentoDto } from './dto/import-dimensionamento.dto';
export declare class DimensionamentoService {
    private dimensionamentoRepository;
    constructor(dimensionamentoRepository: Repository<Dimensionamento>);
    create(createDimensionamentoDto: CreateDimensionamentoDto): Promise<Dimensionamento>;
    findAll(): Promise<Dimensionamento[]>;
    findAllPaginated(params: {
        page: number;
        limit: number;
        search?: string;
        regiao?: string;
        opm?: string;
        risp?: string;
        aisp?: string;
    }): Promise<{
        items: Dimensionamento[];
        total: number;
        page: number;
        limit: number;
        hasMore: boolean;
    }>;
    findByRegiao(regiao: string): Promise<Dimensionamento[]>;
    findByOpm(opm: string): Promise<Dimensionamento[]>;
    findByRisp(risp: string): Promise<Dimensionamento[]>;
    findByAisp(aisp: string): Promise<Dimensionamento[]>;
    findOne(id: string): Promise<Dimensionamento>;
    findByCodigo(codigo: number): Promise<Dimensionamento>;
    update(id: string, updateDimensionamentoDto: UpdateDimensionamentoDto): Promise<Dimensionamento>;
    remove(id: string): Promise<void>;
    import(importDto: ImportDimensionamentoDto): Promise<{
        imported: number;
        errors: string[];
    }>;
    getStats(): Promise<{
        total: number;
        porRegiao: Record<string, number>;
        porRisp: Record<string, number>;
        porAisp: Record<string, number>;
    }>;
}

import { DimensionamentoService } from './dimensionamento.service';
import { CreateDimensionamentoDto } from './dto/create-dimensionamento.dto';
import { UpdateDimensionamentoDto } from './dto/update-dimensionamento.dto';
import { ImportDimensionamentoDto } from './dto/import-dimensionamento.dto';
export declare class DimensionamentoController {
    private readonly dimensionamentoService;
    constructor(dimensionamentoService: DimensionamentoService);
    create(createDimensionamentoDto: CreateDimensionamentoDto): Promise<import("./entities/dimensionamento.entity").Dimensionamento>;
    findAll(page?: string, limit?: string, search?: string, regiao?: string, opm?: string, risp?: string, aisp?: string): Promise<import("./entities/dimensionamento.entity").Dimensionamento[]> | Promise<{
        items: import("./entities/dimensionamento.entity").Dimensionamento[];
        total: number;
        page: number;
        limit: number;
        hasMore: boolean;
    }>;
    test(): {
        message: string;
        timestamp: string;
    };
    debug(): Promise<{
        message: string;
        totalRecords: number;
        stats: {
            total: number;
            porRegiao: Record<string, number>;
            porRisp: Record<string, number>;
            porAisp: Record<string, number>;
        };
        sampleData: import("./entities/dimensionamento.entity").Dimensionamento[];
        timestamp: string;
    }>;
    getStats(): Promise<{
        total: number;
        porRegiao: Record<string, number>;
        porRisp: Record<string, number>;
        porAisp: Record<string, number>;
    }>;
    findByCodigo(codigo: number): Promise<import("./entities/dimensionamento.entity").Dimensionamento>;
    findOne(id: string): Promise<import("./entities/dimensionamento.entity").Dimensionamento>;
    update(id: string, updateDimensionamentoDto: UpdateDimensionamentoDto): Promise<import("./entities/dimensionamento.entity").Dimensionamento>;
    remove(id: string): Promise<void>;
    import(importDto: ImportDimensionamentoDto): Promise<{
        imported: number;
        errors: string[];
    }>;
    importTest(importDto: ImportDimensionamentoDto): Promise<{
        imported: number;
        errors: string[];
    }>;
}

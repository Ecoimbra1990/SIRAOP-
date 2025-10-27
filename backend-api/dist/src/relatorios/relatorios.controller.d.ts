import { Response } from 'express';
import { RelatoriosService } from './relatorios.service';
declare class GerarInformativoDto {
    ocorrenciaIds: string[];
}
export declare class RelatoriosController {
    private readonly relatoriosService;
    constructor(relatoriosService: RelatoriosService);
    gerarInformativoPDF(gerarInformativoDto: GerarInformativoDto, res: Response): Promise<void>;
}
export {};

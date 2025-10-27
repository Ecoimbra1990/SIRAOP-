import { OcorrenciasService } from '../ocorrencias/ocorrencias.service';
export declare class RelatoriosService {
    private ocorrenciasService;
    constructor(ocorrenciasService: OcorrenciasService);
    gerarInformativoPDF(ocorrenciaIds: string[]): Promise<Buffer>;
    private gerarHTMLRelatorio;
}

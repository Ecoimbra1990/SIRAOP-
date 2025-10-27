import { Pessoa } from './pessoa.entity';
import { Polygon } from 'geojson';
export declare class AreaAtuacao {
    id: number;
    pessoa: Pessoa;
    nome_local: string;
    geometria_poligono: Polygon;
    observacoes: string;
    created_at: Date;
    updated_at: Date;
}

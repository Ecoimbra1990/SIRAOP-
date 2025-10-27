import { Polygon } from 'geojson';
export declare class CreateAreaAtuacaoDto {
    nome_local: string;
    geometria_poligono?: Polygon;
    observacoes?: string;
}

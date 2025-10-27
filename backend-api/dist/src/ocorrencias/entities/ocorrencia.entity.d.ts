import { Point } from 'geojson';
export declare class Ocorrencia {
    id: string;
    tipo: string;
    data_hora_fato: Date;
    descricao: string;
    endereco: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    latitude: number;
    longitude: number;
    geometria_ponto: Point;
    opm: string;
    numero_bo: string;
    delegacia: string;
    status: string;
    observacoes: string;
    anexos_urls: string[];
    created_at: Date;
    updated_at: Date;
}

import { Pessoa } from '../../pessoas/entities/pessoa.entity';
export declare class Faccao {
    id: string;
    nome: string;
    sigla: string;
    descricao: string;
    ativa: boolean;
    membros: Pessoa[];
    created_at: Date;
    updated_at: Date;
}

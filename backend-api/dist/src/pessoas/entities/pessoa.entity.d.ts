import { Faccao } from '../../faccoes/entities/faccao.entity';
import { AreaAtuacao } from './area-atuacao.entity';
export declare class Pessoa {
    id: string;
    nome_completo: string;
    cpf: string;
    rg: string;
    data_nascimento: Date;
    nome_pai: string;
    nome_mae: string;
    sexo: string;
    cor: string;
    profissao: string;
    apelidos: string[];
    endereco: string;
    telefone: string;
    email: string;
    foto_url: string;
    faccao: Faccao;
    funcao_faccao: string;
    prioridade: string;
    possui_registros: boolean;
    observacoes: string;
    areas_atuacao: AreaAtuacao[];
    created_at: Date;
    updated_at: Date;
}

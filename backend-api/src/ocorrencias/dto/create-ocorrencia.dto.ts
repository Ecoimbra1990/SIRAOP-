import { IsString, IsOptional, IsDateString, IsNumber, IsArray, IsEnum } from 'class-validator';

export class CreateOcorrenciaDto {
  @IsString()
  tipo: string;

  @IsDateString()
  data_hora_fato: string;

  @IsString()
  descricao: string;

  @IsString()
  endereco: string;

  @IsString()
  @IsOptional()
  bairro?: string;

  @IsString()
  @IsOptional()
  cidade?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  cep?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  opm?: string;

  @IsString()
  @IsOptional()
  numero_bo?: string;

  @IsString()
  @IsOptional()
  delegacia?: string;

  @IsEnum(['ativa', 'arquivada', 'resolvida'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  observacoes?: string;

  @IsArray()
  @IsOptional()
  anexos_urls?: string[];

  // Campos específicos para Informação Relevante
  @IsString()
  @IsOptional()
  fonte_informacao?: string;

  @IsString()
  @IsOptional()
  nome_fonte?: string;

  @IsDateString()
  @IsOptional()
  data_publicacao?: string;

  @IsString()
  @IsOptional()
  link_materia?: string;

  @IsString()
  @IsOptional()
  resumo_informacao?: string;

  @IsString()
  @IsOptional()
  relevancia_seguranca?: string;

  @IsString()
  @IsOptional()
  observacoes_informacao?: string;
}

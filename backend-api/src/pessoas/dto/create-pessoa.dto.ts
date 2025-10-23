import { IsString, IsOptional, IsDateString, IsArray, IsBoolean, IsUUID } from 'class-validator';

export class CreatePessoaDto {
  @IsString()
  nome_completo: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  rg?: string;

  @IsDateString()
  @IsOptional()
  data_nascimento?: string;

  @IsString()
  @IsOptional()
  nome_pai?: string;

  @IsString()
  @IsOptional()
  nome_mae?: string;

  @IsString()
  @IsOptional()
  sexo?: string;

  @IsString()
  @IsOptional()
  cor?: string;

  @IsString()
  @IsOptional()
  profissao?: string;

  @IsArray()
  @IsOptional()
  apelidos?: string[];

  @IsString()
  @IsOptional()
  endereco?: string;

  @IsString()
  @IsOptional()
  telefone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsUUID()
  @IsOptional()
  faccao_id?: string;

  @IsString()
  @IsOptional()
  funcao_faccao?: string;

  @IsString()
  @IsOptional()
  prioridade?: string;

  @IsBoolean()
  @IsOptional()
  possui_registros?: boolean;

  @IsString()
  @IsOptional()
  observacoes?: string;
}

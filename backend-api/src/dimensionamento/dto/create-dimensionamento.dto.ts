import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateDimensionamentoDto {
  @IsNumber()
  codigo: number;

  @IsString()
  regiao: string;

  @IsString()
  municipio_bairro: string;

  @IsString()
  opm: string;

  @IsString()
  risp: string;

  @IsString()
  aisp: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}

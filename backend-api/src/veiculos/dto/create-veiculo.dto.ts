import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateVeiculoDto {
  @IsString()
  @IsOptional()
  placa?: string;

  @IsString()
  @IsOptional()
  renavam?: string;

  @IsString()
  @IsOptional()
  chassi?: string;

  @IsString()
  @IsOptional()
  marca?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsString()
  @IsOptional()
  cor?: string;

  @IsNumber()
  @IsOptional()
  ano_fabricacao?: number;

  @IsNumber()
  @IsOptional()
  ano_modelo?: number;

  @IsString()
  @IsOptional()
  combustivel?: string;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @IsString()
  @IsOptional()
  observacoes?: string;
}

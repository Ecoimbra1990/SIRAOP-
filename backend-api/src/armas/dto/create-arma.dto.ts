import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateArmaDto {
  @IsString()
  @IsOptional()
  numero_serie?: string;

  @IsString()
  @IsOptional()
  marca?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsString()
  @IsOptional()
  calibre?: string;

  @IsString()
  @IsOptional()
  tipo?: string;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsBoolean()
  @IsOptional()
  ativa?: boolean;

  @IsString()
  @IsOptional()
  observacoes?: string;
}

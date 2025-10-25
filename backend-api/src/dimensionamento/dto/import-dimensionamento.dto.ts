import { IsString, IsOptional } from 'class-validator';

export class ImportDimensionamentoDto {
  @IsString()
  csvContent: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}

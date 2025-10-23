import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Polygon } from 'geojson';

export class CreateAreaAtuacaoDto {
  @IsString()
  @IsNotEmpty()
  nome_local: string;

  @IsOptional()
  geometria_poligono?: Polygon;

  @IsString()
  @IsOptional()
  observacoes?: string;
}

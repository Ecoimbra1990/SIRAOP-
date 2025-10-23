import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateFaccaoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  sigla?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsBoolean()
  @IsOptional()
  ativa?: boolean;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateDimensionamentoDto } from './create-dimensionamento.dto';

export class UpdateDimensionamentoDto extends PartialType(CreateDimensionamentoDto) {}

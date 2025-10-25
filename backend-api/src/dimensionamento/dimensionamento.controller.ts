import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query,
  ParseIntPipe 
} from '@nestjs/common';
import { DimensionamentoService } from './dimensionamento.service';
import { CreateDimensionamentoDto } from './dto/create-dimensionamento.dto';
import { UpdateDimensionamentoDto } from './dto/update-dimensionamento.dto';
import { ImportDimensionamentoDto } from './dto/import-dimensionamento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dimensionamento')
export class DimensionamentoController {
  constructor(private readonly dimensionamentoService: DimensionamentoService) {}

  @Post()
  create(@Body() createDimensionamentoDto: CreateDimensionamentoDto) {
    return this.dimensionamentoService.create(createDimensionamentoDto);
  }

  @Get()
  findAll(
    @Query('regiao') regiao?: string,
    @Query('opm') opm?: string,
    @Query('risp') risp?: string,
    @Query('aisp') aisp?: string,
  ) {
    if (regiao) {
      return this.dimensionamentoService.findByRegiao(regiao);
    }
    if (opm) {
      return this.dimensionamentoService.findByOpm(opm);
    }
    if (risp) {
      return this.dimensionamentoService.findByRisp(risp);
    }
    if (aisp) {
      return this.dimensionamentoService.findByAisp(aisp);
    }
    return this.dimensionamentoService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.dimensionamentoService.getStats();
  }

  @Get('codigo/:codigo')
  findByCodigo(@Param('codigo', ParseIntPipe) codigo: number) {
    return this.dimensionamentoService.findByCodigo(codigo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dimensionamentoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDimensionamentoDto: UpdateDimensionamentoDto) {
    return this.dimensionamentoService.update(id, updateDimensionamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dimensionamentoService.remove(id);
  }

  @Post('import')
  import(@Body() importDto: ImportDimensionamentoDto) {
    return this.dimensionamentoService.import(importDto);
  }
}

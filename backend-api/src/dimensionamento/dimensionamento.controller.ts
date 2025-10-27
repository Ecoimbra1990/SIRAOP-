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

@Controller('dimensionamento')
export class DimensionamentoController {
  constructor(private readonly dimensionamentoService: DimensionamentoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDimensionamentoDto: CreateDimensionamentoDto) {
    return this.dimensionamentoService.create(createDimensionamentoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('regiao') regiao?: string,
    @Query('opm') opm?: string,
    @Query('risp') risp?: string,
    @Query('aisp') aisp?: string,
  ) {
    // Se há parâmetros de paginação, usar método paginado
    if (page || limit || search) {
      return this.dimensionamentoService.findAllPaginated({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 50,
        search,
        regiao,
        opm,
        risp,
        aisp
      });
    }

    // Caso contrário, usar métodos específicos
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

  @Get('test')
  test() {
    return { message: 'Dimensionamento API funcionando', timestamp: new Date().toISOString() };
  }

  @Get('debug')
  async debug() {
    const all = await this.dimensionamentoService.findAll();
    const stats = await this.dimensionamentoService.getStats();
    
    return {
      message: 'Debug info',
      totalRecords: all.length,
      stats: stats,
      sampleData: all.slice(0, 3),
      timestamp: new Date().toISOString()
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() {
    return this.dimensionamentoService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('codigo/:codigo')
  findByCodigo(@Param('codigo', ParseIntPipe) codigo: number) {
    return this.dimensionamentoService.findByCodigo(codigo);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dimensionamentoService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDimensionamentoDto: UpdateDimensionamentoDto) {
    return this.dimensionamentoService.update(id, updateDimensionamentoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dimensionamentoService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('import')
  import(@Body() importDto: ImportDimensionamentoDto) {
    return this.dimensionamentoService.import(importDto);
  }

  @Post('import-test')
  importTest(@Body() importDto: ImportDimensionamentoDto) {
    return this.dimensionamentoService.import(importDto);
  }
}

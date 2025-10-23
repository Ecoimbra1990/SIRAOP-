import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ArmasService } from './armas.service';
import { CreateArmaDto } from './dto/create-arma.dto';
import { UpdateArmaDto } from './dto/update-arma.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('armas')
export class ArmasController {
  constructor(private readonly armasService: ArmasService) {}

  @Post()
  create(@Body() createArmaDto: CreateArmaDto) {
    return this.armasService.create(createArmaDto);
  }

  @Get()
  findAll() {
    return this.armasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.armasService.findOne(id);
  }

  @Get('numero-serie/:numeroSerie')
  findByNumeroSerie(@Param('numeroSerie') numeroSerie: string) {
    return this.armasService.findByNumeroSerie(numeroSerie);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArmaDto: UpdateArmaDto) {
    return this.armasService.update(id, updateArmaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.armasService.remove(id);
  }
}

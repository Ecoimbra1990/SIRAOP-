import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FaccoesService } from './faccoes.service';
import { CreateFaccaoDto } from './dto/create-faccao.dto';
import { UpdateFaccaoDto } from './dto/update-faccao.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('faccoes')
export class FaccoesController {
  constructor(private readonly faccoesService: FaccoesService) {}

  @Post()
  create(@Body() createFaccaoDto: CreateFaccaoDto) {
    return this.faccoesService.create(createFaccaoDto);
  }

  @Get()
  findAll() {
    return this.faccoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faccoesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaccaoDto: UpdateFaccaoDto) {
    return this.faccoesService.update(id, updateFaccaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faccoesService.remove(id);
  }
}

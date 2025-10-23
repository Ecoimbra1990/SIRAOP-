import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { CreateAreaAtuacaoDto } from './dto/create-area-atuacao.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Post()
  create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoasService.create(createPessoaDto);
  }

  @Get()
  findAll() {
    return this.pessoasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pessoasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePessoaDto: UpdatePessoaDto) {
    return this.pessoasService.update(id, updatePessoaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pessoasService.remove(id);
  }

  // Endpoint para upload de foto
  @Post(':id/upload-foto')
  @UseInterceptors(FileInterceptor('file'))
  uploadFoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.pessoasService.uploadFoto(id, file);
  }

  // Endpoint para adicionar área de atuação (polígono)
  @Post(':id/area-atuacao')
  addAreaAtuacao(
    @Param('id') id: string,
    @Body() areaDto: CreateAreaAtuacaoDto,
  ) {
    return this.pessoasService.addArea(id, areaDto);
  }
}

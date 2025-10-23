import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcorrenciasService } from './ocorrencias.service';
import { CreateOcorrenciaDto } from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ocorrencias')
export class OcorrenciasController {
  constructor(private readonly ocorrenciasService: OcorrenciasService) {}

  @Post()
  create(@Body() createOcorrenciaDto: CreateOcorrenciaDto) {
    return this.ocorrenciasService.create(createOcorrenciaDto);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.ocorrenciasService.findAll();
  }

  @Get('nearby')
  findNearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius?: number,
  ) {
    return this.ocorrenciasService.findNearby(lat, lng, radius);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ocorrenciasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOcorrenciaDto: UpdateOcorrenciaDto) {
    return this.ocorrenciasService.update(id, updateOcorrenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ocorrenciasService.remove(id);
  }

  @Post(':id/upload-anexo')
  @UseInterceptors(FileInterceptor('file'))
  uploadAnexo(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ocorrenciasService.uploadAnexo(id, file);
  }
}

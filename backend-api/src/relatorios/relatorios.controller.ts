import { Controller, Post, Body, UseGuards, Res, Header } from '@nestjs/common';
import { Response } from 'express';
import { RelatoriosService } from './relatorios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsArray, IsString } from 'class-validator';

class GerarInformativoDto {
  @IsArray()
  @IsString({ each: true })
  ocorrenciaIds: string[];
}

@UseGuards(JwtAuthGuard)
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Post('informativo-pdf')
  @Header('Content-Type', 'application/pdf')
  async gerarInformativoPDF(
    @Body() gerarInformativoDto: GerarInformativoDto,
    @Res() res: Response,
  ) {
    try {
      const pdf = await this.relatoriosService.gerarInformativoPDF(
        gerarInformativoDto.ocorrenciaIds,
      );

      const filename = `informativo_${Date.now()}.pdf`;
      
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdf);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao gerar relatório PDF',
        message: error.message,
      });
    }
  }
}

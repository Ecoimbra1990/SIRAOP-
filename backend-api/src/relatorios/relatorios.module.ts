import { Module } from '@nestjs/common';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';
import { OcorrenciasModule } from '../ocorrencias/ocorrencias.module';

@Module({
  imports: [OcorrenciasModule],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}

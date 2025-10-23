import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcorrenciasController } from './ocorrencias.controller';
import { OcorrenciasService } from './ocorrencias.service';
import { Ocorrencia } from './entities/ocorrencia.entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ocorrencia]),
    StorageModule,
  ],
  controllers: [OcorrenciasController],
  providers: [OcorrenciasService],
  exports: [OcorrenciasService],
})
export class OcorrenciasModule {}

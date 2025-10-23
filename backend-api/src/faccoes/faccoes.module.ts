import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaccoesController } from './faccoes.controller';
import { FaccoesService } from './faccoes.service';
import { Faccao } from './entities/faccao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Faccao])],
  controllers: [FaccoesController],
  providers: [FaccoesService],
  exports: [FaccoesService],
})
export class FaccoesModule {}

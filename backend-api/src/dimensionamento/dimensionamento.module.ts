import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DimensionamentoService } from './dimensionamento.service';
import { DimensionamentoController } from './dimensionamento.controller';
import { Dimensionamento } from './entities/dimensionamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dimensionamento])],
  controllers: [DimensionamentoController],
  providers: [DimensionamentoService],
  exports: [DimensionamentoService],
})
export class DimensionamentoModule {}

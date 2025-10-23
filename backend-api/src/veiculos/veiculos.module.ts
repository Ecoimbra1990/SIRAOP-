import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeiculosController } from './veiculos.controller';
import { VeiculosService } from './veiculos.service';
import { Veiculo } from './entities/veiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Veiculo])],
  controllers: [VeiculosController],
  providers: [VeiculosService],
  exports: [VeiculosService],
})
export class VeiculosModule {}

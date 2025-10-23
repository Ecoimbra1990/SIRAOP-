import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArmasController } from './armas.controller';
import { ArmasService } from './armas.service';
import { Arma } from './entities/arma.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Arma])],
  controllers: [ArmasController],
  providers: [ArmasService],
  exports: [ArmasService],
})
export class ArmasModule {}

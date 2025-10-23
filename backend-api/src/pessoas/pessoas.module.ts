import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasController } from './pessoas.controller';
import { PessoasService } from './pessoas.service';
import { Pessoa } from './entities/pessoa.entity';
import { AreaAtuacao } from './entities/area-atuacao.entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pessoa, AreaAtuacao]),
    StorageModule,
  ],
  controllers: [PessoasController],
  providers: [PessoasService],
  exports: [PessoasService],
})
export class PessoasModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faccao } from './entities/faccao.entity';
import { CreateFaccaoDto } from './dto/create-faccao.dto';
import { UpdateFaccaoDto } from './dto/update-faccao.dto';

@Injectable()
export class FaccoesService {
  constructor(
    @InjectRepository(Faccao)
    private faccoesRepository: Repository<Faccao>,
  ) {}

  async create(createFaccaoDto: CreateFaccaoDto): Promise<Faccao> {
    const faccao = this.faccoesRepository.create(createFaccaoDto);
    return this.faccoesRepository.save(faccao);
  }

  async findAll(): Promise<Faccao[]> {
    return this.faccoesRepository.find({
      where: { ativa: true },
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Faccao> {
    return this.faccoesRepository.findOne({ where: { id } });
  }

  async update(id: string, updateFaccaoDto: UpdateFaccaoDto): Promise<Faccao> {
    await this.faccoesRepository.update(id, updateFaccaoDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.faccoesRepository.delete(id);
  }
}

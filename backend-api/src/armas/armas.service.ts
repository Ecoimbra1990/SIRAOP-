import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Arma } from './entities/arma.entity';
import { CreateArmaDto } from './dto/create-arma.dto';
import { UpdateArmaDto } from './dto/update-arma.dto';

@Injectable()
export class ArmasService {
  constructor(
    @InjectRepository(Arma)
    private armasRepository: Repository<Arma>,
  ) {}

  async create(createArmaDto: CreateArmaDto): Promise<Arma> {
    const arma = this.armasRepository.create(createArmaDto);
    return this.armasRepository.save(arma);
  }

  async findAll(): Promise<Arma[]> {
    return this.armasRepository.find({
      where: { ativa: true },
      order: { marca: 'ASC', modelo: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Arma> {
    return this.armasRepository.findOne({ where: { id } });
  }

  async findByNumeroSerie(numeroSerie: string): Promise<Arma> {
    return this.armasRepository.findOne({ where: { numero_serie: numeroSerie } });
  }

  async update(id: string, updateArmaDto: UpdateArmaDto): Promise<Arma> {
    await this.armasRepository.update(id, updateArmaDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.armasRepository.delete(id);
  }
}

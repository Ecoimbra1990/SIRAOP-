import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo } from './entities/veiculo.entity';
import { CreateVeiculoDto } from './dto/create-veiculo.dto';
import { UpdateVeiculoDto } from './dto/update-veiculo.dto';

@Injectable()
export class VeiculosService {
  constructor(
    @InjectRepository(Veiculo)
    private veiculosRepository: Repository<Veiculo>,
  ) {}

  async create(createVeiculoDto: CreateVeiculoDto): Promise<Veiculo> {
    const veiculo = this.veiculosRepository.create(createVeiculoDto);
    return this.veiculosRepository.save(veiculo);
  }

  async findAll(): Promise<Veiculo[]> {
    return this.veiculosRepository.find({
      where: { ativo: true },
      order: { marca: 'ASC', modelo: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Veiculo> {
    return this.veiculosRepository.findOne({ where: { id } });
  }

  async findByPlaca(placa: string): Promise<Veiculo> {
    return this.veiculosRepository.findOne({ where: { placa } });
  }

  async update(id: string, updateVeiculoDto: UpdateVeiculoDto): Promise<Veiculo> {
    await this.veiculosRepository.update(id, updateVeiculoDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.veiculosRepository.delete(id);
  }
}

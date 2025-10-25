import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dimensionamento } from './entities/dimensionamento.entity';
import { CreateDimensionamentoDto } from './dto/create-dimensionamento.dto';
import { UpdateDimensionamentoDto } from './dto/update-dimensionamento.dto';
import { ImportDimensionamentoDto } from './dto/import-dimensionamento.dto';

@Injectable()
export class DimensionamentoService {
  constructor(
    @InjectRepository(Dimensionamento)
    private dimensionamentoRepository: Repository<Dimensionamento>,
  ) {}

  async create(createDimensionamentoDto: CreateDimensionamentoDto): Promise<Dimensionamento> {
    // Verificar se já existe um registro com o mesmo código
    const existing = await this.dimensionamentoRepository.findOne({
      where: { codigo: createDimensionamentoDto.codigo }
    });

    if (existing) {
      throw new BadRequestException('Já existe um registro com este código');
    }

    const dimensionamento = this.dimensionamentoRepository.create(createDimensionamentoDto);
    return this.dimensionamentoRepository.save(dimensionamento);
  }

  async findAll(): Promise<Dimensionamento[]> {
    return this.dimensionamentoRepository.find({
      order: { codigo: 'ASC' }
    });
  }

  async findByRegiao(regiao: string): Promise<Dimensionamento[]> {
    return this.dimensionamentoRepository.find({
      where: { regiao },
      order: { municipio_bairro: 'ASC' }
    });
  }

  async findByOpm(opm: string): Promise<Dimensionamento[]> {
    return this.dimensionamentoRepository.find({
      where: { opm },
      order: { municipio_bairro: 'ASC' }
    });
  }

  async findByRisp(risp: string): Promise<Dimensionamento[]> {
    return this.dimensionamentoRepository.find({
      where: { risp },
      order: { municipio_bairro: 'ASC' }
    });
  }

  async findByAisp(aisp: string): Promise<Dimensionamento[]> {
    return this.dimensionamentoRepository.find({
      where: { aisp },
      order: { municipio_bairro: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Dimensionamento> {
    const dimensionamento = await this.dimensionamentoRepository.findOne({
      where: { id }
    });

    if (!dimensionamento) {
      throw new NotFoundException('Dimensionamento não encontrado');
    }

    return dimensionamento;
  }

  async findByCodigo(codigo: number): Promise<Dimensionamento> {
    const dimensionamento = await this.dimensionamentoRepository.findOne({
      where: { codigo }
    });

    if (!dimensionamento) {
      throw new NotFoundException('Dimensionamento não encontrado');
    }

    return dimensionamento;
  }

  async update(id: string, updateDimensionamentoDto: UpdateDimensionamentoDto): Promise<Dimensionamento> {
    const dimensionamento = await this.findOne(id);
    
    // Se está alterando o código, verificar se não existe outro com o mesmo código
    if (updateDimensionamentoDto.codigo && updateDimensionamentoDto.codigo !== dimensionamento.codigo) {
      const existing = await this.dimensionamentoRepository.findOne({
        where: { codigo: updateDimensionamentoDto.codigo }
      });

      if (existing) {
        throw new BadRequestException('Já existe um registro com este código');
      }
    }

    Object.assign(dimensionamento, updateDimensionamentoDto);
    return this.dimensionamentoRepository.save(dimensionamento);
  }

  async remove(id: string): Promise<void> {
    const dimensionamento = await this.findOne(id);
    await this.dimensionamentoRepository.remove(dimensionamento);
  }

  async import(importDto: ImportDimensionamentoDto): Promise<{ imported: number; errors: string[] }> {
    const lines = importDto.csvContent.split('\n').filter(line => line.trim());
    const errors: string[] = [];
    let imported = 0;

    // Processar cada linha do CSV
    for (let i = 1; i < lines.length; i++) { // Pular cabeçalho
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const [id, regiao, municipio_bairro, opm, risp, aisp] = line.split(';');
        
        if (!id || !regiao || !municipio_bairro || !opm || !risp || !aisp) {
          errors.push(`Linha ${i + 1}: Campos obrigatórios faltando`);
          continue;
        }

        const codigo = parseInt(id);
        if (isNaN(codigo)) {
          errors.push(`Linha ${i + 1}: ID inválido`);
          continue;
        }

        // Verificar se já existe
        const existing = await this.dimensionamentoRepository.findOne({
          where: { codigo }
        });

        if (existing) {
          // Atualizar registro existente
          existing.regiao = regiao;
          existing.municipio_bairro = municipio_bairro;
          existing.opm = opm;
          existing.risp = risp;
          existing.aisp = aisp;
          existing.observacoes = importDto.observacoes;
          existing.ativo = true;
          
          await this.dimensionamentoRepository.save(existing);
        } else {
          // Criar novo registro
          const dimensionamento = this.dimensionamentoRepository.create({
            codigo,
            regiao,
            municipio_bairro,
            opm,
            risp,
            aisp,
            observacoes: importDto.observacoes,
            ativo: true
          });

          await this.dimensionamentoRepository.save(dimensionamento);
        }

        imported++;
      } catch (error) {
        errors.push(`Linha ${i + 1}: ${error.message}`);
      }
    }

    return { imported, errors };
  }

  async getStats(): Promise<{
    total: number;
    porRegiao: Record<string, number>;
    porRisp: Record<string, number>;
    porAisp: Record<string, number>;
  }> {
    const all = await this.dimensionamentoRepository.find();
    
    const stats = {
      total: all.length,
      porRegiao: {},
      porRisp: {},
      porAisp: {}
    };

    all.forEach(item => {
      stats.porRegiao[item.regiao] = (stats.porRegiao[item.regiao] || 0) + 1;
      stats.porRisp[item.risp] = (stats.porRisp[item.risp] || 0) + 1;
      stats.porAisp[item.aisp] = (stats.porAisp[item.aisp] || 0) + 1;
    });

    return stats;
  }
}

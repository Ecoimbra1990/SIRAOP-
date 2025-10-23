import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { AreaAtuacao } from './entities/area-atuacao.entity';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { CreateAreaAtuacaoDto } from './dto/create-area-atuacao.dto';
import { StorageService } from '../storage/storage.service';
import * as crypto from 'crypto';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private pessoasRepository: Repository<Pessoa>,
    @InjectRepository(AreaAtuacao)
    private areasRepository: Repository<AreaAtuacao>,
    private storageService: StorageService,
  ) {}

  async create(createPessoaDto: CreatePessoaDto): Promise<Pessoa> {
    const pessoa = this.pessoasRepository.create(createPessoaDto);
    
    // Criptografar CPF se fornecido
    if (pessoa.cpf) {
      pessoa.cpf = this.encryptCpf(pessoa.cpf);
    }

    return this.pessoasRepository.save(pessoa);
  }

  async findAll(): Promise<Pessoa[]> {
    const pessoas = await this.pessoasRepository.find({
      relations: ['faccao', 'areas_atuacao'],
      order: { nome_completo: 'ASC' },
    });

    // Descriptografar CPFs para exibição
    return pessoas.map(pessoa => ({
      ...pessoa,
      cpf: pessoa.cpf ? this.decryptCpf(pessoa.cpf) : null,
    }));
  }

  async findOne(id: string): Promise<Pessoa> {
    const pessoa = await this.pessoasRepository.findOne({
      where: { id },
      relations: ['faccao', 'areas_atuacao'],
    });

    if (pessoa) {
      // Descriptografar CPF para exibição
      pessoa.cpf = pessoa.cpf ? this.decryptCpf(pessoa.cpf) : null;
    }

    return pessoa;
  }

  async update(id: string, updatePessoaDto: UpdatePessoaDto): Promise<Pessoa> {
    const pessoa = await this.findOne(id);
    
    // Criptografar CPF se foi alterado
    if (updatePessoaDto.cpf && updatePessoaDto.cpf !== pessoa.cpf) {
      updatePessoaDto.cpf = this.encryptCpf(updatePessoaDto.cpf);
    }

    await this.pessoasRepository.update(id, updatePessoaDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.pessoasRepository.delete(id);
  }

  async uploadFoto(id: string, file: Express.Multer.File): Promise<string> {
    const pessoa = await this.findOne(id);
    if (!pessoa) {
      throw new Error('Pessoa não encontrada');
    }

    const destination = `pessoas/${id}/foto_${Date.now()}.${file.originalname.split('.').pop()}`;
    const fotoUrl = await this.storageService.uploadFile(file, destination);
    
    await this.pessoasRepository.update(id, { foto_url: fotoUrl });
    return fotoUrl;
  }

  async addArea(id: string, areaDto: CreateAreaAtuacaoDto): Promise<AreaAtuacao> {
    const pessoa = await this.findOne(id);
    if (!pessoa) {
      throw new Error('Pessoa não encontrada');
    }

    const area = this.areasRepository.create({
      ...areaDto,
      pessoa,
    });

    return this.areasRepository.save(area);
  }

  private encryptCpf(cpf: string): string {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.CPF_ENCRYPTION_KEY || 'default-key-32-chars-long-12345', 'utf8');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(cpf, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  private decryptCpf(encryptedCpf: string): string {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.CPF_ENCRYPTION_KEY || 'default-key-32-chars-long-12345', 'utf8');
    
    const textParts = encryptedCpf.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = textParts.join(':');
    
    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

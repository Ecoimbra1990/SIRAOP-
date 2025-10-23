import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Faccao } from '../../faccoes/entities/faccao.entity';
import { AreaAtuacao } from './area-atuacao.entity';

@Entity('pessoas')
export class Pessoa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome_completo: string;

  @Column({ unique: true, nullable: true })
  cpf: string; // Deve ser criptografado

  @Column({ nullable: true })
  rg: string;

  @Column({ nullable: true })
  data_nascimento: Date;

  @Column({ nullable: true })
  nome_pai: string;

  @Column({ nullable: true })
  nome_mae: string;

  @Column({ nullable: true })
  sexo: string; // 'M', 'F'

  @Column({ nullable: true })
  cor: string; // 'Branca', 'Parda', 'Negra', 'Amarela', 'Indígena'

  @Column({ nullable: true })
  profissao: string;

  @Column('simple-array', { nullable: true })
  apelidos: string[];

  @Column({ type: 'text', nullable: true })
  endereco: string;

  @Column({ nullable: true })
  telefone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  foto_url: string; // URL da foto no Google Cloud Storage

  @ManyToOne(() => Faccao, (faccao) => faccao.membros, { nullable: true })
  faccao: Faccao;

  @Column({ nullable: true })
  funcao_faccao: string; // Ex: 'Líder', 'Gatilho'

  @Column({ nullable: true })
  prioridade: string; // Ex: 'Prioritário com mandado'

  @Column({ default: false })
  possui_registros: boolean;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  // Relação com área de atuação
  @OneToMany(() => AreaAtuacao, (area) => area.pessoa)
  areas_atuacao: AreaAtuacao[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

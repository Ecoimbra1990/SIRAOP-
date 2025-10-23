import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';

@Entity('faccoes')
export class Faccao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nome: string;

  @Column({ nullable: true })
  sigla: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ default: true })
  ativa: boolean;

  @OneToMany(() => Pessoa, (pessoa) => pessoa.faccao)
  membros: Pessoa[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

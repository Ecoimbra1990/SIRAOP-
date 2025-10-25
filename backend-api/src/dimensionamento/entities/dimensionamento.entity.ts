import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('dimensionamento')
export class Dimensionamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unique: true })
  codigo: number;

  @Column({ type: 'varchar', length: 50 })
  regiao: string;

  @Column({ type: 'varchar', length: 200 })
  municipio_bairro: string;

  @Column({ type: 'varchar', length: 100 })
  opm: string;

  @Column({ type: 'varchar', length: 50 })
  risp: string;

  @Column({ type: 'varchar', length: 50 })
  aisp: string;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

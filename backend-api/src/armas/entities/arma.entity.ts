import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('armas')
export class Arma {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  numero_serie: string;

  @Column({ nullable: true })
  marca: string;

  @Column({ nullable: true })
  modelo: string;

  @Column({ nullable: true })
  calibre: string;

  @Column({ nullable: true })
  tipo: string; // 'Pistola', 'Revólver', 'Fuzil', 'Espingarda', etc.

  @Column({ nullable: true })
  categoria: string; // 'Permitida', 'Restrita', 'Proibida'

  @Column({ default: true })
  ativa: boolean;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

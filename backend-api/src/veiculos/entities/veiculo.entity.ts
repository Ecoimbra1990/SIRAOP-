import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('veiculos')
export class Veiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  placa: string;

  @Column({ nullable: true })
  renavam: string;

  @Column({ nullable: true })
  chassi: string;

  @Column({ nullable: true })
  marca: string;

  @Column({ nullable: true })
  modelo: string;

  @Column({ nullable: true })
  cor: string;

  @Column({ nullable: true })
  ano_fabricacao: number;

  @Column({ nullable: true })
  ano_modelo: number;

  @Column({ nullable: true })
  combustivel: string; // 'Gasolina', 'Álcool', 'Flex', 'Diesel', etc.

  @Column({ nullable: true })
  categoria: string; // 'Automóvel', 'Motocicleta', 'Caminhão', etc.

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

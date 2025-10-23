import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Será criptografada com bcrypt

  @Column()
  nome_completo: string;

  @Column()
  matricula: string; // Matrícula do policial

  @Column({ nullable: true })
  telefone: string;

  @Column({ default: 'policial' })
  role: string; // 'admin', 'policial', 'supervisor'

  @Column({ default: true })
  ativo: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

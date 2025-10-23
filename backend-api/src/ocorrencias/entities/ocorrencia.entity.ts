import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Point } from 'geojson';

@Entity('ocorrencias')
export class Ocorrencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tipo: string; // 'Homicídio', 'Roubo', 'Tráfico', etc.

  @Column()
  data_hora_fato: Date;

  @Column({ type: 'text' })
  descricao: string;

  @Column()
  endereco: string;

  @Column({ nullable: true })
  bairro: string;

  @Column({ nullable: true })
  cidade: string;

  @Column({ nullable: true })
  estado: string;

  @Column({ nullable: true })
  cep: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Index({ spatial: true }) // CRÍTICO para consultas espaciais
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326, // Padrão WGS 84
    nullable: true,
  })
  geometria_ponto: Point; // Será populado a partir da lat/long

  @Column({ nullable: true })
  opm: string; // Órgão Policial Militar

  @Column({ nullable: true })
  numero_bo: string; // Número do Boletim de Ocorrência

  @Column({ nullable: true })
  delegacia: string;

  @Column({ default: 'ativa' })
  status: string; // 'ativa', 'arquivada', 'resolvida'

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ type: 'simple-array', nullable: true })
  anexos_urls: string[]; // URLs dos arquivos anexos no GCS

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

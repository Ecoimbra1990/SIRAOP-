import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Pessoa } from './pessoa.entity';
import { Polygon } from 'geojson';

@Entity('pessoas_areas_atuacao')
export class AreaAtuacao {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pessoa, (pessoa) => pessoa.areas_atuacao, { onDelete: 'CASCADE' })
  pessoa: Pessoa;

  @Column()
  nome_local: string; // Ex: "BURACÃO, TANCREDO NEVES"

  @Index({ spatial: true }) // CRÍTICO para consultas espaciais
  @Column({
    type: 'geography',
    spatialFeatureType: 'Polygon',
    srid: 4326, // Padrão WGS 84
    nullable: true,
  })
  geometria_poligono: Polygon;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

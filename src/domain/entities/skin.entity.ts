import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type SkinRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

@Entity('skins')
export class Skin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'case_id', type: 'varchar', length: 50 })
  caseId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  weapon: string;

  @Column({ type: 'varchar', length: 50 })
  rarity: SkinRarity;

  @Column({ type: 'decimal', precision: 5, scale: 3 })
  chance: number;

  @Column({ type: 'varchar', length: 500 })
  image: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


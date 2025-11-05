import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar' })
  userId: string;

  @Column({ name: 'skin_id', type: 'varchar', nullable: true })
  skinId: string;

  @Column({ name: 'skin_name', type: 'varchar', length: 255 })
  skinName: string;

  @Column({ name: 'skin_image', type: 'varchar', length: 500 })
  skinImage: string;

  @Column({ type: 'varchar', length: 50 })
  rarity: ItemRarity;

  @Column({ name: 'case_name', type: 'varchar', length: 255 })
  caseName: string;

  @Column({ name: 'case_id', type: 'varchar', length: 50 })
  caseId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ name: 'won_at', type: 'timestamp' })
  wonAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}


import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

export type CaseRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

@Entity('cases')
export class Case {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 500 })
  image: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  rarity: CaseRarity;

  @Column({ name: 'is_free', type: 'boolean' })
  isFree: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calculateRarityAndFree() {
    this.isFree = this.price === 0;

    if (this.price === 0) {
      this.rarity = 'common';
    } else if (this.price < 3) {
      this.rarity = 'common';
    } else if (this.price < 5) {
      this.rarity = 'uncommon';
    } else if (this.price < 7) {
      this.rarity = 'rare';
    } else if (this.price < 9) {
      this.rarity = 'epic';
    } else {
      this.rarity = 'legendary';
    }
  }
}



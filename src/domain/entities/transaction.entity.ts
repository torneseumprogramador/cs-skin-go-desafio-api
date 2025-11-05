import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type TransactionType = 'deposit' | 'case_open' | 'withdrawal';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'case_name', type: 'varchar', length: 255, nullable: true })
  caseName?: string;

  @Column({ name: 'case_id', type: 'varchar', length: 50, nullable: true })
  caseId?: string;

  @Column({ name: 'skin_won', type: 'varchar', length: 255, nullable: true })
  skinWon?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}


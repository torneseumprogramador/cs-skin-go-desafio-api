import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  findByUserId(userId: string, type?: string, limit?: number, offset?: number): Promise<[Transaction[], number]>;
  create(transaction: Partial<Transaction>): Promise<Transaction>;
  save(transaction: Transaction): Promise<Transaction>;
}


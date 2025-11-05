import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository.interface';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async findByUserId(
    userId: string,
    type?: string,
    limit = 50,
    offset = 0,
  ): Promise<[Transaction[], number]> {
    const queryBuilder = this.transactionRepo.createQueryBuilder('transaction');
    queryBuilder.where('transaction.userId = :userId', { userId });

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    queryBuilder.orderBy('transaction.date', 'DESC').skip(offset).take(limit);

    return queryBuilder.getManyAndCount();
  }

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const trans = this.transactionRepo.create(transaction);
    return this.transactionRepo.save(trans);
  }

  async save(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepo.save(transaction);
  }
}


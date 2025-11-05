import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../../../domain/repositories/transaction.repository.interface';

@Injectable()
export class GetTransactionsUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(userId: string, type?: string, limit = 50, offset = 0) {
    const [transactions, total] = await this.transactionRepository.findByUserId(
      userId,
      type,
      limit,
      offset,
    );

    return {
      transactions: transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: parseFloat(t.amount.toString()),
        description: t.description,
        caseName: t.caseName,
        skinWon: t.skinWon,
        date: t.date,
      })),
      total,
    };
  }
}


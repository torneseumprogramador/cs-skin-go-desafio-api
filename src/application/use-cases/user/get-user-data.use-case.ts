import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IInventoryRepository } from '../../../domain/repositories/inventory.repository.interface';
import { ITransactionRepository } from '../../../domain/repositories/transaction.repository.interface';

@Injectable()
export class GetUserDataUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly inventoryRepository: IInventoryRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(userId: string) {
    const userData = await this.userRepository.findUserDataByUserId(userId);

    if (!userData) {
      throw new NotFoundException('Dados do usuário não encontrados');
    }

    const inventory = await this.inventoryRepository.findByUserId(userId);
    const [transactions] = await this.transactionRepository.findByUserId(userId, undefined, 50);

    return {
      data: {
        userId,
        balance: parseFloat(userData.balance.toString()),
        inventory: inventory.map((item) => ({
          id: item.id,
          skinName: item.skinName,
          skinImage: item.skinImage,
          rarity: item.rarity,
          caseName: item.caseName,
          wonAt: item.wonAt,
          value: parseFloat(item.value.toString()),
        })),
        transactions: transactions.map((t) => ({
          id: t.id,
          type: t.type,
          amount: parseFloat(t.amount.toString()),
          description: t.description,
          caseName: t.caseName,
          skinWon: t.skinWon,
          date: t.date,
        })),
      },
    };
  }
}



import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IInventoryRepository } from '../../../domain/repositories/inventory.repository.interface';
import { ITransactionRepository } from '../../../domain/repositories/transaction.repository.interface';

@Injectable()
export class GetUserDataUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IInventoryRepository')
    private readonly inventoryRepository: IInventoryRepository,
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(userId: string) {
    let userData = await this.userRepository.findUserDataByUserId(userId);

    // Se não existir, criar automaticamente com saldo 0
    if (!userData) {
      console.log(`[GET USER DATA] Criando UserData para usuário ${userId}`);
      userData = await this.userRepository.createUserData({
        userId,
        balance: 0,
      });
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



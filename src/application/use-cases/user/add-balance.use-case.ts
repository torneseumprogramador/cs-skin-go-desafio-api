import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { ITransactionRepository } from '../../../domain/repositories/transaction.repository.interface';

@Injectable()
export class AddBalanceUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(userId: string, amount: number, description: string) {
    if (amount <= 0) {
      throw new BadRequestException('Valor deve ser maior que 0');
    }

    const userData = await this.userRepository.findUserDataByUserId(userId);

    if (!userData) {
      throw new NotFoundException('Dados do usuário não encontrados');
    }

    // Atualizar saldo
    userData.balance = parseFloat(userData.balance.toString()) + amount;
    await this.userRepository.saveUserData(userData);

    // Criar transação
    const transaction = await this.transactionRepository.create({
      userId,
      type: 'deposit',
      amount,
      description,
      date: new Date(),
    });

    return {
      success: true,
      data: {
        balance: parseFloat(userData.balance.toString()),
        transaction: {
          id: transaction.id,
          type: transaction.type,
          amount: parseFloat(transaction.amount.toString()),
          description: transaction.description,
          date: transaction.date,
        },
      },
    };
  }
}


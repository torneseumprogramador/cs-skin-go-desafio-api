import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ICaseRepository } from '../../../domain/repositories/case.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { IInventoryRepository } from '../../../domain/repositories/inventory.repository.interface';
import { ITransactionRepository } from '../../../domain/repositories/transaction.repository.interface';
import { Skin } from '../../../domain/entities/skin.entity';

@Injectable()
export class OpenCaseUseCase {
  constructor(
    @Inject('ICaseRepository')
    private readonly caseRepository: ICaseRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IInventoryRepository')
    private readonly inventoryRepository: IInventoryRepository,
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  // Algoritmo de Weighted Random Selection
  private selectRandomSkin(skins: Skin[]): Skin {
    let totalChance = 0;
    const cumulativeChances: Array<{ skin: Skin; cumulativeChance: number }> = [];

    for (const skin of skins) {
      totalChance += parseFloat(skin.chance.toString());
      cumulativeChances.push({
        skin,
        cumulativeChance: totalChance,
      });
    }

    const random = Math.random() * totalChance;
    const selected = cumulativeChances.find((item) => random <= item.cumulativeChance);

    return selected ? selected.skin : cumulativeChances[cumulativeChances.length - 1].skin;
  }

  // Calcular valor da skin baseado na raridade
  private calculateSkinValue(rarity: string): number {
    const valueRanges = {
      common: { min: 0.1, max: 1.0 },
      uncommon: { min: 1.0, max: 5.0 },
      rare: { min: 5.0, max: 20.0 },
      epic: { min: 20.0, max: 100.0 },
      legendary: { min: 100.0, max: 1000.0 },
    };

    const range = valueRanges[rarity] || valueRanges.common;
    const value = Math.random() * (range.max - range.min) + range.min;

    return parseFloat(value.toFixed(2));
  }

  async execute(userId: string, caseId: string) {
    // Usar transação do banco para garantir consistência
    return await this.dataSource.transaction(async (manager) => {
      // 1. Verificar se o case existe
      const caseEntity = await this.caseRepository.findById(caseId);

      if (!caseEntity) {
        throw new NotFoundException('Case não encontrado');
      }

      const skins = await this.caseRepository.findSkinsByCaseId(caseId);

      if (!skins || skins.length === 0) {
        throw new BadRequestException('Case não possui skins disponíveis');
      }

      // 2. Buscar dados do usuário
      const userData = await this.userRepository.findUserDataByUserId(userId);

      if (!userData) {
        throw new NotFoundException('Dados do usuário não encontrados');
      }

      // 3. Verificar saldo suficiente (exceto cases gratuitos)
      const casePrice = parseFloat(caseEntity.price.toString());
      const currentBalance = parseFloat(userData.balance.toString());

      if (casePrice > 0 && currentBalance < casePrice) {
        throw new BadRequestException('Saldo insuficiente');
      }

      // 4. Deduzir valor do case do saldo
      userData.balance = currentBalance - casePrice;
      await this.userRepository.saveUserData(userData);

      // 5. Sortear uma skin usando weighted random
      const selectedSkin = this.selectRandomSkin(skins);

      // 6. Calcular valor da skin
      const skinValue = this.calculateSkinValue(selectedSkin.rarity);

      // 7. Adicionar skin ao inventário
      const inventoryItem = await this.inventoryRepository.create({
        userId,
        skinId: selectedSkin.id,
        skinName: selectedSkin.name,
        skinImage: selectedSkin.image,
        rarity: selectedSkin.rarity,
        caseName: caseEntity.name,
        caseId: caseEntity.id,
        value: skinValue,
        wonAt: new Date(),
      });

      // 8. Criar transação
      await this.transactionRepository.create({
        userId,
        type: 'case_open',
        amount: -casePrice,
        description: `Abertura de caixa: ${caseEntity.name}`,
        caseName: caseEntity.name,
        caseId: caseEntity.id,
        skinWon: selectedSkin.name,
        date: new Date(),
      });

      // 9. Retornar resultado
      return {
        success: true,
        skin: {
          id: selectedSkin.id,
          name: selectedSkin.name,
          weapon: selectedSkin.weapon,
          rarity: selectedSkin.rarity,
          image: selectedSkin.image,
          value: skinValue,
        },
        inventoryItem: {
          id: inventoryItem.id,
          skinName: inventoryItem.skinName,
          skinImage: inventoryItem.skinImage,
          rarity: inventoryItem.rarity,
          caseName: inventoryItem.caseName,
          wonAt: inventoryItem.wonAt,
          value: skinValue,
        },
        userData: {
          balance: parseFloat(userData.balance.toString()),
          totalSpent: casePrice,
        },
      };
    });
  }
}



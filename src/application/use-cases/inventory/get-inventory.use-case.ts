import { Injectable } from '@nestjs/common';
import { IInventoryRepository } from '../../../domain/repositories/inventory.repository.interface';

@Injectable()
export class GetInventoryUseCase {
  constructor(private readonly inventoryRepository: IInventoryRepository) {}

  async execute(userId: string, sortBy = 'date', order: 'ASC' | 'DESC' = 'DESC', rarity?: string) {
    const inventory = await this.inventoryRepository.findByUserId(userId, sortBy, order, rarity);

    const totalValue = inventory.reduce((sum, item) => sum + parseFloat(item.value.toString()), 0);

    return {
      inventory: inventory.map((item) => ({
        id: item.id,
        skinName: item.skinName,
        skinImage: item.skinImage,
        rarity: item.rarity,
        caseName: item.caseName,
        wonAt: item.wonAt,
        value: parseFloat(item.value.toString()),
      })),
      totalValue,
      totalItems: inventory.length,
    };
  }
}


import { Injectable, Inject } from '@nestjs/common';
import { IInventoryRepository } from '../../../domain/repositories/inventory.repository.interface';

export interface AddInventoryItemDto {
  skinName: string;
  skinImage: string;
  rarity: string;
  caseName: string;
  caseId: string;
  value: number;
}

@Injectable()
export class AddInventoryItemUseCase {
  constructor(
    @Inject('IInventoryRepository')
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async execute(userId: string, data: AddInventoryItemDto) {
    const item = await this.inventoryRepository.create({
      userId,
      skinName: data.skinName,
      skinImage: data.skinImage,
      rarity: data.rarity as any,
      caseName: data.caseName,
      caseId: data.caseId,
      value: data.value,
      wonAt: new Date(),
    });

    return {
      success: true,
      item: {
        id: item.id,
        skinName: item.skinName,
        skinImage: item.skinImage,
        rarity: item.rarity,
        caseName: item.caseName,
        wonAt: item.wonAt,
        value: parseFloat(item.value.toString()),
      },
    };
  }
}


import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IInventoryRepository } from '../../../domain/repositories/inventory.repository.interface';

@Injectable()
export class RemoveInventoryItemUseCase {
  constructor(private readonly inventoryRepository: IInventoryRepository) {}

  async execute(userId: string, itemId: string) {
    const item = await this.inventoryRepository.findById(itemId);

    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    if (item.userId !== userId) {
      throw new ForbiddenException('Item não pertence ao usuário');
    }

    await this.inventoryRepository.delete(item);

    return {
      success: true,
      message: 'Item removido do inventário',
    };
  }
}


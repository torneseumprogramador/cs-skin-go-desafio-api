import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '../../domain/entities/inventory-item.entity';
import { IInventoryRepository } from '../../domain/repositories/inventory.repository.interface';

@Injectable()
export class InventoryRepository implements IInventoryRepository {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepo: Repository<InventoryItem>,
  ) {}

  async findByUserId(
    userId: string,
    sortBy = 'date',
    order: 'ASC' | 'DESC' = 'DESC',
    rarity?: string,
  ): Promise<InventoryItem[]> {
    const queryBuilder = this.inventoryRepo.createQueryBuilder('item');
    queryBuilder.where('item.userId = :userId', { userId });

    if (rarity) {
      queryBuilder.andWhere('item.rarity = :rarity', { rarity });
    }

    const orderField =
      sortBy === 'value' ? 'item.value' : sortBy === 'rarity' ? 'item.rarity' : 'item.wonAt';
    queryBuilder.orderBy(orderField, order);

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<InventoryItem | null> {
    return this.inventoryRepo.findOne({ where: { id } });
  }

  async create(item: Partial<InventoryItem>): Promise<InventoryItem> {
    const inventoryItem = this.inventoryRepo.create(item);
    return this.inventoryRepo.save(inventoryItem);
  }

  async save(item: InventoryItem): Promise<InventoryItem> {
    return this.inventoryRepo.save(item);
  }

  async delete(item: InventoryItem): Promise<void> {
    await this.inventoryRepo.remove(item);
  }
}


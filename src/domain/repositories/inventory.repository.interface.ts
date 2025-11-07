import { InventoryItem } from '../entities/inventory-item.entity';

export interface IInventoryRepository {
  findByUserId(userId: string, sortBy?: string, order?: 'ASC' | 'DESC', rarity?: string): Promise<InventoryItem[]>;
  findById(id: string): Promise<InventoryItem | null>;
  create(item: Partial<InventoryItem>): Promise<InventoryItem>;
  save(item: InventoryItem): Promise<InventoryItem>;
  delete(item: InventoryItem): Promise<void>;
}



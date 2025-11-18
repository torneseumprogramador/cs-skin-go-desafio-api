import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../domain/entities/user.entity';
import { UserData } from '../domain/entities/user-data.entity';
import { Case } from '../domain/entities/case.entity';
import { Skin } from '../domain/entities/skin.entity';
import { InventoryItem } from '../domain/entities/inventory-item.entity';
import { Transaction } from '../domain/entities/transaction.entity';

// Carrega variáveis de ambiente a partir do .env da pasta do backend
config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'cs_skin_go',
  entities: [User, UserData, Case, Skin, InventoryItem, Transaction],
  migrations: ['src/database/migrations/*.ts'],
  charset: 'utf8mb4',
  synchronize: false,
  logging: true,
});


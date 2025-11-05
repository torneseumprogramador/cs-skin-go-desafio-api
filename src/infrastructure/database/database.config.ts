import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../domain/entities/user.entity';
import { UserData } from '../../domain/entities/user-data.entity';
import { Case } from '../../domain/entities/case.entity';
import { Skin } from '../../domain/entities/skin.entity';
import { InventoryItem } from '../../domain/entities/inventory-item.entity';
import { Transaction } from '../../domain/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, UserData, Case, Skin, InventoryItem, Transaction],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        charset: 'utf8mb4',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}


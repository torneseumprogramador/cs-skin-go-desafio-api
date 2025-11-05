import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Database Module
import { DatabaseModule } from './infrastructure/database/database.config';

// Entities
import { User } from './domain/entities/user.entity';
import { UserData } from './domain/entities/user-data.entity';
import { Case } from './domain/entities/case.entity';
import { Skin } from './domain/entities/skin.entity';
import { InventoryItem } from './domain/entities/inventory-item.entity';
import { Transaction } from './domain/entities/transaction.entity';

// Repositories
import { UserRepository } from './infrastructure/repositories/user.repository';
import { CaseRepository } from './infrastructure/repositories/case.repository';
import { InventoryRepository } from './infrastructure/repositories/inventory.repository';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';

// Use Cases - Auth
import { RegisterUserUseCase } from './application/use-cases/auth/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/auth/login-user.use-case';
import { GetCurrentUserUseCase } from './application/use-cases/auth/get-current-user.use-case';

// Use Cases - Cases
import { ListCasesUseCase } from './application/use-cases/cases/list-cases.use-case';
import { GetCaseDetailsUseCase } from './application/use-cases/cases/get-case-details.use-case';
import { OpenCaseUseCase } from './application/use-cases/cases/open-case.use-case';

// Use Cases - User
import { GetUserDataUseCase } from './application/use-cases/user/get-user-data.use-case';
import { AddBalanceUseCase } from './application/use-cases/user/add-balance.use-case';

// Use Cases - Inventory
import { GetInventoryUseCase } from './application/use-cases/inventory/get-inventory.use-case';
import { AddInventoryItemUseCase } from './application/use-cases/inventory/add-inventory-item.use-case';
import { RemoveInventoryItemUseCase } from './application/use-cases/inventory/remove-inventory-item.use-case';

// Use Cases - Transactions
import { GetTransactionsUseCase } from './application/use-cases/transactions/get-transactions.use-case';

// Controllers
import { AuthController } from './presentation/controllers/auth.controller';
import { CasesController } from './presentation/controllers/cases.controller';
import { UserController } from './presentation/controllers/user.controller';

// Strategies
import { JwtStrategy } from './presentation/strategies/jwt.strategy';

// Providers
const repositories = [
  {
    provide: 'IUserRepository',
    useClass: UserRepository,
  },
  {
    provide: 'ICaseRepository',
    useClass: CaseRepository,
  },
  {
    provide: 'IInventoryRepository',
    useClass: InventoryRepository,
  },
  {
    provide: 'ITransactionRepository',
    useClass: TransactionRepository,
  },
];

const useCases = [
  // Auth
  RegisterUserUseCase,
  LoginUserUseCase,
  GetCurrentUserUseCase,
  // Cases
  ListCasesUseCase,
  GetCaseDetailsUseCase,
  OpenCaseUseCase,
  // User
  GetUserDataUseCase,
  AddBalanceUseCase,
  // Inventory
  GetInventoryUseCase,
  AddInventoryItemUseCase,
  RemoveInventoryItemUseCase,
  // Transactions
  GetTransactionsUseCase,
];

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL) || 60,
        limit: parseInt(process.env.RATE_LIMIT_MAX) || 100,
      },
    ]),

    // Database
    DatabaseModule,
    TypeOrmModule.forFeature([User, UserData, Case, Skin, InventoryItem, Transaction]),

    // Auth
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '7d',
        },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [AuthController, CasesController, UserController],

  providers: [
    // Repositories (concrete implementations)
    UserRepository,
    CaseRepository,
    InventoryRepository,
    TransactionRepository,
    // Use Cases
    ...useCases,
    // Strategies
    JwtStrategy,
  ],
})
export class AppModule {}

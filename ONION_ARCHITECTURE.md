# 🧅 Onion Architecture - CS Skin GO API

## 📐 O que é Onion Architecture?

A **Onion Architecture** (também conhecida como Clean Architecture ou Hexagonal Architecture) é um padrão arquitetural que organiza o código em camadas concêntricas, onde cada camada tem responsabilidades bem definidas e as dependências sempre apontam para dentro (em direção ao núcleo).

### Princípios Fundamentais

1. **Independência de frameworks**: O domínio não depende de frameworks externos
2. **Testabilidade**: Fácil de testar cada camada isoladamente
3. **Independência de UI**: A interface pode mudar sem afetar o negócio
4. **Independência de banco de dados**: Banco pode ser trocado sem afetar regras de negócio
5. **Inversão de dependências**: Dependências apontam sempre para dentro

---

## 🏗️ Estrutura da Aplicação

```
src/
├── domain/                          # 🔵 CAMADA 1: Núcleo do Domínio
│   ├── entities/                    # Entidades de domínio puras
│   │   ├── user.entity.ts
│   │   ├── user-data.entity.ts
│   │   ├── case.entity.ts
│   │   ├── skin.entity.ts
│   │   ├── inventory-item.entity.ts
│   │   └── transaction.entity.ts
│   └── repositories/                # Interfaces dos repositórios (contratos)
│       ├── user.repository.interface.ts
│       ├── case.repository.interface.ts
│       ├── inventory.repository.interface.ts
│       └── transaction.repository.interface.ts
│
├── application/                     # 🟢 CAMADA 2: Casos de Uso
│   ├── use-cases/                   # Lógica de aplicação/negócio
│   │   ├── auth/
│   │   │   ├── register-user.use-case.ts
│   │   │   ├── login-user.use-case.ts
│   │   │   └── get-current-user.use-case.ts
│   │   ├── cases/
│   │   │   ├── list-cases.use-case.ts
│   │   │   ├── get-case-details.use-case.ts
│   │   │   └── open-case.use-case.ts
│   │   ├── user/
│   │   │   ├── get-user-data.use-case.ts
│   │   │   └── add-balance.use-case.ts
│   │   ├── inventory/
│   │   │   ├── get-inventory.use-case.ts
│   │   │   ├── add-inventory-item.use-case.ts
│   │   │   └── remove-inventory-item.use-case.ts
│   │   └── transactions/
│   │       └── get-transactions.use-case.ts
│   └── dto/                         # Data Transfer Objects
│       ├── register.dto.ts
│       ├── login.dto.ts
│       ├── add-balance.dto.ts
│       └── add-inventory-item.dto.ts
│
├── infrastructure/                  # 🟡 CAMADA 3: Infraestrutura
│   ├── database/                    # Configuração do banco de dados
│   │   └── database.config.ts
│   ├── repositories/                # Implementações concretas dos repositórios
│   │   ├── user.repository.ts
│   │   ├── case.repository.ts
│   │   ├── inventory.repository.ts
│   │   └── transaction.repository.ts
│   └── seeds/                       # Seeds de dados
│       ├── cases-seed.data.ts
│       └── run-seeds.ts
│
└── presentation/                    # 🔴 CAMADA 4: Apresentação
    ├── controllers/                 # Controllers HTTP
    │   ├── auth.controller.ts
    │   ├── cases.controller.ts
    │   └── user.controller.ts
    ├── guards/                      # Guards de autenticação
    │   └── jwt-auth.guard.ts
    ├── strategies/                  # Estratégias de autenticação
    │   └── jwt.strategy.ts
    ├── decorators/                  # Decorators customizados
    │   └── current-user.decorator.ts
    └── filters/                     # Exception filters
        └── http-exception.filter.ts
```

---

## 🔵 Camada 1: Domain (Núcleo)

**Responsabilidade:** Entidades de negócio e regras de domínio puras.

**Características:**
- ✅ Não depende de nenhuma outra camada
- ✅ Não conhece frameworks (NestJS, TypeORM, etc)
- ✅ Contém apenas lógica de domínio pura
- ✅ Define interfaces (contratos) para repositórios

**Exemplo:**

```typescript
// domain/entities/user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;
}

// domain/repositories/user.repository.interface.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: Partial<User>): Promise<User>;
}
```

---

## 🟢 Camada 2: Application (Casos de Uso)

**Responsabilidade:** Orquestração da lógica de negócio.

**Características:**
- ✅ Depende apenas da camada Domain
- ✅ Implementa casos de uso (use cases)
- ✅ Orquestra entidades e repositórios
- ✅ Contém a lógica de aplicação

**Exemplo:**

```typescript
// application/use-cases/auth/register-user.use-case.ts
@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(name: string, email: string, password: string) {
    // Validações
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      success: true,
      message: 'Usuário criado com sucesso',
    };
  }
}
```

---

## 🟡 Camada 3: Infrastructure (Infraestrutura)

**Responsabilidade:** Implementações concretas de tecnologias externas.

**Características:**
- ✅ Implementa as interfaces definidas no Domain
- ✅ Contém código específico de frameworks (TypeORM, MySQL, etc)
- ✅ Configurações de banco de dados
- ✅ Integração com serviços externos

**Exemplo:**

```typescript
// infrastructure/repositories/user.repository.ts
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }
}
```

---

## 🔴 Camada 4: Presentation (Apresentação)

**Responsabilidade:** Interface com o mundo externo (HTTP, CLI, etc).

**Características:**
- ✅ Controllers HTTP
- ✅ DTOs de entrada/saída
- ✅ Guards e middlewares
- ✅ Transformação de dados para API

**Exemplo:**

```typescript
// presentation/controllers/auth.controller.ts
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.registerUserUseCase.execute(
      registerDto.name,
      registerDto.email,
      registerDto.password,
    );
  }
}
```

---

## 🔄 Fluxo de Dependências

```
Presentation (Controllers)
        ↓
   Application (Use Cases)
        ↓
    Domain (Entities + Interfaces)
        ↑
Infrastructure (Repositories - implementações)
```

**Importante:** As dependências **sempre apontam para dentro**!

- ✅ Controllers conhecem Use Cases
- ✅ Use Cases conhecem Entities e Interfaces
- ✅ Repositories implementam Interfaces do Domain
- ❌ Domain NÃO conhece nenhuma outra camada

---

## 🎯 Vantagens desta Arquitetura

### 1. **Testabilidade**
- Use Cases podem ser testados sem banco de dados (usando mocks)
- Cada camada pode ser testada isoladamente

### 2. **Manutenibilidade**
- Código organizado e fácil de encontrar
- Responsabilidades bem definidas
- Mudanças em uma camada não afetam outras

### 3. **Flexibilidade**
- Trocar banco de dados? Apenas mude a camada Infrastructure
- Trocar framework? Apenas mude a camada Presentation
- Regras de negócio ficam protegidas no núcleo

### 4. **Escalabilidade**
- Fácil adicionar novos casos de uso
- Fácil adicionar novos endpoints
- Código cresce de forma organizada

### 5. **Independência de Frameworks**
- Lógica de negócio não depende do NestJS
- Pode ser portada para outro framework facilmente

---

## 📦 Registro no App Module

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TypeOrmModule.forFeature([User, UserData, Case, Skin, InventoryItem, Transaction]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({...}),
  ],

  controllers: [
    // Presentation Layer
    AuthController,
    CasesController,
    UserController,
  ],

  providers: [
    // Infrastructure Layer - Repositórios concretos
    UserRepository,
    CaseRepository,
    InventoryRepository,
    TransactionRepository,

    // Application Layer - Use Cases
    RegisterUserUseCase,
    LoginUserUseCase,
    ListCasesUseCase,
    OpenCaseUseCase,
    // ... outros use cases

    // Presentation Layer - Strategies
    JwtStrategy,
  ],
})
export class AppModule {}
```

---

## 🆚 Comparação: Modular vs Onion

### Arquitetura Modular (antes)

```
auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts       # Tudo junto
└── dto/
```

**Problemas:**
- ❌ Lógica de negócio misturada com infraestrutura
- ❌ Difícil de testar
- ❌ Alto acoplamento
- ❌ Difícil de trocar tecnologias

### Onion Architecture (agora)

```
domain/          # Entidades puras
application/     # Casos de uso
infrastructure/  # Implementações
presentation/    # Controllers
```

**Vantagens:**
- ✅ Separação clara de responsabilidades
- ✅ Fácil de testar
- ✅ Baixo acoplamento
- ✅ Fácil de trocar tecnologias

---

## 🧪 Testando com Onion Architecture

### Teste de Use Case (sem banco)

```typescript
describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as any;

    useCase = new RegisterUserUseCase(mockUserRepository);
  });

  it('should register a new user', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue({
      id: '123',
      name: 'Test',
      email: 'test@example.com',
    } as User);

    const result = await useCase.execute('Test', 'test@example.com', 'pass123');

    expect(result.success).toBe(true);
    expect(mockUserRepository.create).toHaveBeenCalled();
  });
});
```

---

## 📚 Conceitos Importantes

### SOLID Principles

Esta arquitetura aplica os princípios SOLID:

- **S**ingle Responsibility: Cada classe tem uma responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Interfaces podem ser substituídas por implementações
- **I**nterface Segregation: Interfaces específicas e enxutas
- **D**ependency Inversion: Dependências em abstrações, não em concreções

### Dependency Injection

- Use Cases recebem repositórios via constructor
- Controllers recebem Use Cases via constructor
- NestJS gerencia todas as dependências automaticamente

### Repository Pattern

- Abstração da camada de dados
- Definimos interfaces no Domain
- Implementamos na Infrastructure
- Use Cases dependem apenas das interfaces

---

## 🎓 Quando Usar Onion Architecture?

✅ **Use quando:**
- Projeto de médio/grande porte
- Precisa de testabilidade alta
- Equipe grande
- Longo prazo de manutenção
- Múltiplas integrações externas
- Regras de negócio complexas

❌ **Não use quando:**
- Projeto muito pequeno/simples
- Protótipo rápido
- Time muito pequeno
- Deadline extremamente curto

---

## 🚀 Resultado Final

Com Onion Architecture, temos:

- ✅ **Código limpo e organizado**
- ✅ **Fácil de entender**
- ✅ **Fácil de testar**
- ✅ **Fácil de manter**
- ✅ **Fácil de escalar**
- ✅ **Independente de frameworks**
- ✅ **Pronto para produção**

---

**Desenvolvido com ❤️ seguindo Clean Architecture principles**


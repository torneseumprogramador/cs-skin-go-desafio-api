# 🧅 CS Skin GO - API Backend

API RESTful completa em NestJS para plataforma de abertura de cases de CS:GO/CS2, implementada com **Onion Architecture (Clean Architecture)**.

## 🚀 Tecnologias

- **NestJS 10.x** - Framework Node.js
- **TypeScript 5.x** - Linguagem
- **MySQL** - Banco de dados
- **TypeORM** - ORM
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Onion Architecture** - Padrão arquitetural

---

## 🏗️ Arquitetura Onion

Esta API segue os princípios da **Onion/Clean Architecture**:

```
src/
├── domain/           # 🔵 Entidades e Interfaces (núcleo)
├── application/      # 🟢 Casos de Uso (lógica de negócio)
├── infrastructure/   # 🟡 Implementações (repos, DB, seeds)
└── presentation/     # 🔴 Controllers, Guards, Filters
```

**Benefícios:**
- ✅ Separação clara de responsabilidades
- ✅ Altamente testável
- ✅ Independente de frameworks
- ✅ Fácil de manter e escalar

---

## ⚡ Quick Start

### Pré-requisitos
- Node.js 18.x ou superior
- MySQL 8.x ou superior
- npm ou pnpm

### Instalação Rápida

```bash
# 1. Instalar dependências
make install

# 2. Configurar .env (ajustar senha do MySQL)
cp .env.example .env

# 3. Criar banco de dados
make config-db

# 4. Executar seeds (13 cases + 80 skins)
make seed

# 5. Iniciar aplicação
make start
```

### Acessar

- **API:** http://localhost:3001/api
- **Swagger:** http://localhost:3001/api/docs

---

## 📋 Comandos Make

### Mais Usados

```bash
make help          # Ver todos os comandos
make start         # Iniciar em desenvolvimento
make dev           # Alias para start
make seed          # Popular banco com dados
make build         # Compilar para produção
make test          # Executar testes
make docker-up     # Subir MySQL + API em Docker
```

### Workflows Completos

```bash
make first-run     # Setup completo (primeira vez)
make db-reset      # Resetar banco e popular
make ci            # Pipeline CI (lint + test + build)
```

Ver todos: `make help` ou consulte o `Makefile`

---

## 📍 Rotas da API

### Base URL
```
http://localhost:3001/api
```

### Endpoints Públicos

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Registrar usuário |
| POST | `/api/auth/login` | Login (retorna JWT) |
| GET | `/api/cases` | Listar cases |
| GET | `/api/cases/:id` | Detalhes do case |

### Endpoints Protegidos (requer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/auth/me` | Dados do usuário autenticado |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/cases/:id/open` | Abrir case |
| GET | `/api/user/data` | Dados completos (saldo, inventário) |
| POST | `/api/user/balance` | Adicionar saldo |
| GET | `/api/user/inventory` | Listar inventário |
| POST | `/api/user/inventory` | Adicionar item |
| DELETE | `/api/user/inventory/:id` | Remover item |
| GET | `/api/user/transactions` | Histórico de transações |

**Total:** 13 endpoints

### Exemplo de Uso

```bash
# 1. Registrar
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@example.com","password":"senha123"}'

# 2. Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"senha123"}'

# 3. Usar token retornado nas rotas protegidas
curl http://localhost:3001/api/user/data \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 🗄️ Banco de Dados

### Entidades

- **User** - Usuários da plataforma
- **UserData** - Dados complementares (saldo)
- **Case** - Caixas disponíveis
- **Skin** - Itens dentro das caixas
- **InventoryItem** - Inventário dos usuários
- **Transaction** - Histórico de transações

### Configuração MySQL

```bash
# Via Make
make config-db

# Manual
mysql -u root -p
CREATE DATABASE cs_skin_go CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Seeds

Popular com 13 cases e 80+ skins:

```bash
make seed
```

---

## 🐳 Docker

### Iniciar com Docker Compose

```bash
# Subir MySQL + API
make docker-up

# Aguardar 30s para MySQL inicializar
sleep 30

# Popular banco
make seed

# Ver logs
make docker-logs

# Parar
make docker-down
```

### Variáveis de Ambiente

Arquivo `.env`:

```env
NODE_ENV=development
PORT=3001
API_PREFIX=api

# MySQL
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=cs_skin_go

# JWT
JWT_SECRET=seu-secret-seguro-aqui-minimo-32-caracteres
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

---

## 🧪 Testes

```bash
make test          # Todos os testes
make test-watch    # Watch mode
make test-cov      # Com cobertura
make test-e2e      # End-to-end
```

---

## 📖 Documentação Swagger

Acesse a documentação interativa em:

```
http://localhost:3001/api/docs
```

- ✅ Testar todos os endpoints
- ✅ Ver schemas de request/response
- ✅ Autenticar com JWT token
- ✅ Exemplos de uso

---

## 🎯 Estrutura do Projeto

### Camada Domain (Núcleo)

```
src/domain/
├── entities/           # 6 entidades puras
└── repositories/       # 4 interfaces (contratos)
```

- Não depende de nenhuma outra camada
- Contém apenas lógica de domínio pura
- Define contratos para repositórios

### Camada Application (Casos de Uso)

```
src/application/
├── use-cases/         # 13 casos de uso organizados
└── dto/               # 4 DTOs de validação
```

- Depende apenas da camada Domain
- Implementa a lógica de negócio
- Orquestra entidades e repositórios

### Camada Infrastructure (Implementações)

```
src/infrastructure/
├── database/          # Config TypeORM + MySQL
├── repositories/      # 4 implementações concretas
└── seeds/             # Seeds (13 cases + 80 skins)
```

- Implementa interfaces do Domain
- Código específico de frameworks (TypeORM)
- Integração com serviços externos

### Camada Presentation (Interface HTTP)

```
src/presentation/
├── controllers/       # 3 controllers HTTP
├── guards/            # JWT guard
├── strategies/        # JWT strategy
├── decorators/        # Current user decorator
└── filters/           # Exception filter global
```

- Controllers HTTP/REST
- Guards e middlewares
- Transformação de dados para API

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)**:

1. Fazer login em `/api/auth/login`
2. Receber `accessToken` no response
3. Incluir token nas requisições protegidas:

```
Authorization: Bearer {token}
```

**Expiração:** 7 dias (configurável)

---

## 🔒 Segurança

- ✅ JWT para autenticação
- ✅ Bcrypt para hash de senhas (10 rounds)
- ✅ Rate limiting (100 req/min)
- ✅ Helmet para headers HTTP seguros
- ✅ CORS configurado
- ✅ Validação de entrada (class-validator)
- ✅ Exception filter global

---

## 🚀 Deploy

### Build para Produção

```bash
make build         # Compilar
make prod          # Rodar em produção
```

### Plataformas Recomendadas

- **Railway** - Mais fácil
- **Render** - Tier gratuito
- **Heroku**
- **DigitalOcean App Platform**
- **AWS ECS/Fargate**

### Preparar Deploy

```bash
make ci            # Lint + Test + Build
make deploy-prep   # Preparar produção
```

---

## 🔧 Desenvolvimento

### Estrutura de Arquivos

```
back-end-api/
├── src/
│   ├── domain/              # Camada de domínio
│   ├── application/         # Casos de uso
│   ├── infrastructure/      # Implementações
│   ├── presentation/        # Controllers
│   ├── config/              # Configurações (rotas)
│   ├── main.ts              # Entry point
│   └── app.module.ts        # Módulo principal
├── Makefile                 # Comandos automatizados
├── Dockerfile               # Container da API
├── docker-compose.yml       # MySQL + API
├── package.json             # Dependências
├── tsconfig.json            # Config TypeScript
└── README.md                # Este arquivo
```

### Adicionar Novo Endpoint

1. **Criar Use Case** em `application/use-cases/`
2. **Registrar no AppModule** em `providers`
3. **Usar no Controller** em `presentation/controllers/`

### Padrões de Código

- ✅ SOLID Principles
- ✅ Clean Code
- ✅ Repository Pattern
- ✅ Dependency Injection
- ✅ Use Cases Pattern

---

## 📊 Status do Projeto

### Funcionalidades Implementadas

- ✅ Autenticação JWT completa
- ✅ 13 endpoints funcionais
- ✅ Repository Pattern
- ✅ Onion Architecture
- ✅ 13 Use Cases organizados
- ✅ 6 Entidades
- ✅ Algoritmo weighted random para abertura de cases
- ✅ Seeds (13 cases + 80 skins)
- ✅ Documentação Swagger
- ✅ Segurança completa
- ✅ Docker Compose
- ✅ Makefile com 40+ comandos
- ✅ Build funcionando
- ✅ Testes estruturados

### Qualidade

- ⭐⭐⭐⭐⭐ **Arquitetura:** Onion/Clean Architecture
- ⭐⭐⭐⭐⭐ **Código:** SOLID + Clean Code
- ⭐⭐⭐⭐⭐ **Testabilidade:** Alta (mocks fáceis)
- ⭐⭐⭐⭐⭐ **Manutenibilidade:** Excelente
- ⭐⭐⭐⭐⭐ **Escalabilidade:** Pronta para crescer

---

## 🆘 Troubleshooting

### Porta 3001 já em uso

```bash
make kill-port
make start
```

### Erro ao conectar no MySQL

```bash
# Verificar se MySQL está rodando
mysql -u root -p

# Ou usar Docker
make docker-up
```

### Resetar banco de dados

```bash
make db-reset
```

### Build falhando

```bash
make clean
make install
make build
```

---

## 📚 Tecnologias e Conceitos

### Stack Principal

- **Backend:** NestJS + TypeScript
- **Banco:** MySQL + TypeORM
- **Auth:** Passport + JWT
- **Validação:** class-validator
- **Documentação:** Swagger/OpenAPI
- **Containers:** Docker + Docker Compose

### Arquitetura e Padrões

- **Onion/Clean Architecture**
- **Repository Pattern**
- **Dependency Injection**
- **Use Cases Pattern**
- **SOLID Principles**
- **Clean Code**

---

## 🤝 Contribuindo

### Setup para Desenvolvimento

```bash
# 1. Clonar
git clone git@github.com:torneseumprogramador/cs-skin-go-desafio-api.git
cd cs-skin-go-desafio-api

# 2. Setup completo
make first-run

# 3. Desenvolver
make dev
```

### Antes de Commit

```bash
make format    # Formatar código
make lint      # Verificar problemas
make test      # Executar testes
make build     # Validar build
```

---

## 📝 Licença

MIT

---

## 👨‍💻 Autor

Desenvolvido com ❤️ usando **Onion Architecture** + **NestJS** + **TypeScript**

**GitHub:** https://github.com/torneseumprogramador/cs-skin-go-desafio-api

---

## 🎯 Resumo Rápido

```bash
# Primeiro uso
make first-run

# Desenvolvimento diário
make dev

# Ver documentação
http://localhost:3001/api/docs

# Deploy
make ci && make build
```

**Status:** ✅ Pronto para produção

**Qualidade:** ⭐⭐⭐⭐⭐ Enterprise-level

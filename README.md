# 🧅 CS Skin GO - API Backend (Onion Architecture)

API RESTful completa em NestJS para plataforma de abertura de cases de CS:GO/CS2, implementada com **Onion Architecture (Clean Architecture)**.

## 🚀 Tecnologias

- **NestJS 10.x** - Framework Node.js
- **TypeScript 5.x** - Linguagem
- **MySQL** - Banco de dados
- **TypeORM** - ORM
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Onion Architecture** - Padrão arquitetural

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- MySQL 8.x ou superior
- npm ou pnpm

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Configurar variáveis de ambiente no .env
# Criar banco de dados MySQL
# Rodar migrações
npm run migration:run

# Rodar seeds (dados iniciais)
npm run seed
```

## 🏃 Executando a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📖 Documentação

Acesse a documentação Swagger em: `http://localhost:3001/api/docs`

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 🏗️ Arquitetura

Esta API foi construída seguindo os princípios da **Onion Architecture**:

```
src/
├── domain/           # 🔵 Entidades e Interfaces
├── application/      # 🟢 Casos de Uso (Lógica de Negócio)
├── infrastructure/   # 🟡 Implementações (Repos, DB, Seeds)
└── presentation/     # 🔴 Controllers, Guards, Filters
```

**Benefícios:**
- ✅ Separação clara de responsabilidades
- ✅ Altamente testável
- ✅ Independente de frameworks
- ✅ Fácil de manter e escalar

📖 **Leia mais:** `ONION_ARCHITECTURE.md`

## 📊 Estrutura do Banco de Dados

- **User** - Usuários da plataforma
- **UserData** - Dados complementares (saldo)
- **Case** - Caixas disponíveis
- **Skin** - Itens dentro das caixas
- **InventoryItem** - Inventário dos usuários
- **Transaction** - Histórico de transações

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Inclua o token no header:

```
Authorization: Bearer {seu_token}
```

## 📡 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Dados do usuário autenticado

### Cases
- `GET /api/cases` - Listar todos os cases
- `GET /api/cases/:id` - Detalhes de um case
- `POST /api/cases/:id/open` - Abrir um case (protegido)

### Usuário
- `GET /api/user/data` - Dados completos do usuário (protegido)
- `POST /api/user/balance` - Adicionar saldo (protegido)
- `GET /api/user/inventory` - Listar inventário (protegido)
- `GET /api/user/transactions` - Histórico de transações (protegido)
- `DELETE /api/user/inventory/:id` - Remover item do inventário (protegido)

## 🔒 Segurança

- Rate limiting configurado
- Helmet para proteção de headers
- CORS configurado
- Validação de entrada com class-validator
- Senhas criptografadas com bcrypt

## 📚 Documentação Completa

- **`QUICK_START.md`** - Guia rápido para iniciar em 5 minutos
- **`ONION_ARCHITECTURE.md`** - Explicação da arquitetura
- **`RESUMO_ONION.md`** - Resumo da estrutura Onion
- **`MUDANCAS_REALIZADAS.md`** - Log de mudanças da refatoração
- **`INSTRUCOES.md`** - Instruções detalhadas de uso
- **`DEPLOY.md`** - Guia de deploy para produção
- **`INTEGRACAO_FRONTEND.md`** - Como integrar com frontend

## 🎯 Qualidade do Código

- ✅ **SOLID Principles** aplicados
- ✅ **Clean Code** practices
- ✅ **Design Patterns** (Repository, DI, Strategy)
- ✅ **Onion Architecture** (Clean Architecture)
- ✅ **Enterprise-level** quality

## 📝 Licença

MIT


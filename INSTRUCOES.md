# 📘 Instruções de Instalação e Uso da API

## 🚀 Passo a Passo para Rodar a API

### 1️⃣ Pré-requisitos

Certifique-se de ter instalado:
- **Node.js 18.x ou superior**
- **MySQL 8.x ou superior**
- **npm** ou **pnpm**

### 2️⃣ Instalação das Dependências

No diretório `back-end-api`, execute:

```bash
npm install
```

### 3️⃣ Configurar Banco de Dados MySQL

#### 3.1 Criar o banco de dados

Entre no MySQL:
```bash
mysql -u root -p
```

Crie o banco de dados:
```sql
CREATE DATABASE cs_skin_go CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Saia do MySQL:
```sql
EXIT;
```

#### 3.2 Configurar arquivo .env

O arquivo `.env` já está criado. Verifique e ajuste as credenciais do MySQL:

```env
# Database (MySQL)
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_NAME=cs_skin_go
```

**⚠️ IMPORTANTE:** Substitua `root` pela sua senha do MySQL.

### 4️⃣ Rodar a Aplicação

#### 4.1 Iniciar a API em modo de desenvolvimento

```bash
npm run start:dev
```

A API estará rodando em: **http://localhost:3001/api**

#### 4.2 Sincronizar o banco de dados

Como o `synchronize: true` está ativo em desenvolvimento, as tabelas serão criadas automaticamente ao rodar a aplicação pela primeira vez.

### 5️⃣ Popular o Banco de Dados (Seeds)

Para adicionar os cases e skins iniciais:

```bash
npm run seed
```

Você verá uma saída como:
```
🌱 Iniciando seeds...
✅ Conexão com banco estabelecida
🗑️  Limpando dados existentes...
📦 Inserindo cases e skins...
   ✓ Case "Toolbox Case" criado
   ✓ 12 skins adicionadas ao case "Toolbox Case"
   ...
✅ Seeds executados com sucesso!
```

### 6️⃣ Acessar a Documentação Swagger

Abra no navegador:
```
http://localhost:3001/api/docs
```

Lá você encontrará toda a documentação interativa da API! 📖

---

## 🧪 Testar a API

### Testar Registro de Usuário

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Testar Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

Isso retornará um `accessToken`. Copie-o para usar nas próximas requisições.

### Listar Cases

```bash
curl http://localhost:3001/api/cases
```

### Adicionar Saldo (Protegido)

```bash
curl -X POST http://localhost:3001/api/user/balance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "amount": 100,
    "description": "Depósito inicial"
  }'
```

### Abrir um Case (Protegido)

```bash
curl -X POST http://localhost:3001/api/cases/toolbox/open \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📊 Estrutura da API

### Endpoints Públicos
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/cases` - Listar cases
- `GET /api/cases/:id` - Detalhes de um case

### Endpoints Protegidos (requer token JWT)
- `GET /api/auth/me` - Dados do usuário autenticado
- `POST /api/auth/logout` - Logout
- `POST /api/cases/:id/open` - Abrir case
- `GET /api/user/data` - Dados completos do usuário
- `POST /api/user/balance` - Adicionar saldo
- `GET /api/user/inventory` - Listar inventário
- `DELETE /api/user/inventory/:itemId` - Remover item
- `GET /api/user/transactions` - Histórico de transações

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento (com hot-reload)
npm run start:dev

# Build para produção
npm run build

# Rodar em produção
npm run start:prod

# Executar seeds
npm run seed

# Testes
npm run test

# Linting
npm run lint

# Formatar código
npm run format
```

---

## 🐛 Troubleshooting

### Erro de conexão com MySQL

**Erro:** `ER_NOT_SUPPORTED_AUTH_MODE`

**Solução:**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sua_senha';
FLUSH PRIVILEGES;
```

### Porta 3001 já está em uso

**Solução:** Mude a porta no arquivo `.env`:
```env
PORT=3002
```

### Seed não está funcionando

**Certifique-se de que:**
1. O banco de dados existe
2. A API já rodou pelo menos uma vez (para criar as tabelas)
3. As credenciais no `.env` estão corretas

---

## 📝 Próximos Passos

1. ✅ Testar todos os endpoints no Swagger
2. ✅ Criar um usuário e fazer login
3. ✅ Adicionar saldo
4. ✅ Abrir alguns cases
5. ✅ Ver o inventário
6. 🚀 Integrar o frontend Next.js com esta API

---

## 🔐 Segurança Implementada

- ✅ JWT para autenticação
- ✅ Senhas criptografadas com bcrypt
- ✅ Rate limiting (100 req/min)
- ✅ Helmet para headers de segurança
- ✅ CORS configurado
- ✅ Validação de entrada com class-validator

---

## 📞 Suporte

Se encontrar algum problema, verifique:
1. Se o MySQL está rodando
2. Se as credenciais do `.env` estão corretas
3. Se todas as dependências foram instaladas
4. Os logs do console para erros específicos

---

**API desenvolvida com ❤️ usando NestJS + TypeScript + MySQL**


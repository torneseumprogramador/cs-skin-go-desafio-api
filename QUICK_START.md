# ⚡ Quick Start - CS Skin GO API

Guia rápido para colocar a API funcionando em **5 minutos**!

---

## 🚀 Setup Rápido

### 1️⃣ Instalar Dependências (1 min)

```bash
cd back-end-api
npm install
```

### 2️⃣ Configurar Banco MySQL (2 min)

**Opção A: MySQL Local**

```bash
# Entrar no MySQL
mysql -u root -p

# Criar banco
CREATE DATABASE cs_skin_go CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Opção B: Docker (mais fácil!)**

```bash
# Subir MySQL com Docker
docker run --name cs-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=cs_skin_go -p 3306:3306 -d mysql:8.0
```

### 3️⃣ Configurar .env (30 seg)

O arquivo `.env` já existe! Apenas ajuste a senha do MySQL:

```env
DATABASE_PASSWORD=root  # Mude para sua senha do MySQL
```

### 4️⃣ Iniciar API (30 seg)

```bash
npm run start:dev
```

**Aguarde ver:**
```
🚀 API rodando em: http://localhost:3001/api
📖 Documentação Swagger: http://localhost:3001/api/docs
```

### 5️⃣ Popular Banco de Dados (30 seg)

```bash
# Em outro terminal
npm run seed
```

**Aguarde ver:**
```
✅ Seeds executados com sucesso!
   Total de cases: 13
   Total de skins: 80+
```

---

## ✅ Pronto! API Funcionando

Acesse: **http://localhost:3001/api/docs**

---

## 🧪 Teste Rápido

### 1. Abrir Swagger
http://localhost:3001/api/docs

### 2. Registrar Usuário

**Endpoint:** `POST /api/auth/register`

Clique em "Try it out" e use:
```json
{
  "name": "Teste User",
  "email": "teste@example.com",
  "password": "senha123"
}
```

### 3. Fazer Login

**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "teste@example.com",
  "password": "senha123"
}
```

**Copie o `accessToken` retornado!**

### 4. Autorizar no Swagger

1. Clique no botão **"Authorize"** no topo
2. Cole o token no formato: `Bearer seu_token_aqui`
3. Clique em "Authorize"

### 5. Adicionar Saldo

**Endpoint:** `POST /api/user/balance`

```json
{
  "amount": 100,
  "description": "Depósito inicial"
}
```

### 6. Abrir um Case

**Endpoint:** `POST /api/cases/daily/open`

Clique em "Execute" e veja sua skin! 🎉

---

## 🐳 Alternativa: Rodar Tudo com Docker

```bash
# Subir MySQL + API em containers
docker-compose up -d

# Aguardar 30 segundos para o MySQL iniciar

# Executar seeds
npm run seed

# Pronto! API rodando em http://localhost:3001/api
```

---

## 📝 Comandos Úteis

```bash
# Desenvolvimento (hot-reload)
npm run start:dev

# Parar API
Ctrl+C

# Ver logs
# (os logs aparecem no terminal)

# Resetar banco e popular novamente
npm run seed

# Build para produção
npm run build

# Rodar em produção
npm run start:prod
```

---

## 🔍 Verificar se está Funcionando

### Teste via Browser

Abrir: http://localhost:3001/api/cases

Deve retornar JSON com lista de cases!

### Teste via cURL

```bash
curl http://localhost:3001/api/cases
```

---

## 🐛 Problemas Comuns

### "Cannot connect to MySQL"

**Solução:**
1. Verifique se MySQL está rodando: `sudo service mysql status`
2. Verifique senha no `.env`
3. Teste conexão: `mysql -u root -p`

### "Port 3001 is already in use"

**Solução:** Mude a porta no `.env`:
```env
PORT=3002
```

### "Seeds não funcionam"

**Solução:**
1. Certifique-se que a API rodou pelo menos uma vez (cria tabelas)
2. Verifique se o banco `cs_skin_go` existe
3. Verifique credenciais no `.env`

### "Token expired"

**Solução:** Faça login novamente e pegue um novo token.

---

## 📚 Próximos Passos

1. ✅ Explorar todos os endpoints no Swagger
2. ✅ Ler `RESUMO_COMPLETO.md` para entender a arquitetura
3. ✅ Ler `INTEGRACAO_FRONTEND.md` para integrar com Next.js
4. ✅ Ler `DEPLOY.md` quando for fazer deploy

---

## 🎯 Endpoints Principais

| Endpoint | Método | Auth | Descrição |
|----------|--------|------|-----------|
| `/api/cases` | GET | ❌ | Listar cases |
| `/api/cases/:id` | GET | ❌ | Detalhes do case |
| `/api/auth/register` | POST | ❌ | Registrar |
| `/api/auth/login` | POST | ❌ | Login |
| `/api/cases/:id/open` | POST | ✅ | Abrir case |
| `/api/user/data` | GET | ✅ | Dados do usuário |
| `/api/user/balance` | POST | ✅ | Adicionar saldo |
| `/api/user/inventory` | GET | ✅ | Ver inventário |

✅ = Requer token JWT

---

## 💡 Dicas

1. **Use o Swagger** para testar - é interativo e fácil!
2. **Salve o token** quando fizer login
3. **Cases gratuitos** (Daily Case) não precisam de saldo
4. **Veja o inventário** após abrir cases
5. **Histórico de transações** mostra tudo que você fez

---

## 🎉 Tudo Funcionando?

Parabéns! Sua API está rodando perfeitamente! 🚀

**Agora você pode:**
- ✅ Testar todos os endpoints
- ✅ Integrar com o frontend
- ✅ Fazer deploy em produção

---

**Desenvolvido com ❤️ usando NestJS**

**Precisa de ajuda?** Veja `INSTRUCOES.md` para guia detalhado.


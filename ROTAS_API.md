# 📍 Rotas da API - CS Skin GO

## 🔧 Arquivo de Configuração

As rotas estão centralizadas em: **`src/config/routes.config.ts`**

## 📋 Todas as Rotas

### Base URL
```
http://localhost:3001/api
```

---

## 🔓 Rotas Públicas (sem autenticação)

### 1. Registrar Usuário
```
POST /api/auth/register

Body:
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

### 2. Login
```
POST /api/auth/login

Body:
{
  "email": "joao@example.com",
  "password": "senha123"
}

Response:
{
  "success": true,
  "user": { ... },
  "accessToken": "jwt_token_aqui"
}
```

### 3. Listar Cases
```
GET /api/cases

Response:
{
  "cases": [
    {
      "id": "toolbox",
      "name": "Toolbox Case",
      "price": 12.0,
      "image": "/yellow-toolbox-case-csgo.jpg",
      "rarity": "legendary",
      "isFree": false
    },
    ...
  ]
}
```

### 4. Detalhes do Case
```
GET /api/cases/:id

Exemplo: GET /api/cases/toolbox

Response:
{
  "case": {
    "id": "toolbox",
    "name": "Toolbox Case",
    "skins": [ ... ]
  }
}
```

---

## 🔒 Rotas Protegidas (requer token JWT)

**Header obrigatório:**
```
Authorization: Bearer {seu_token_jwt}
```

### 5. Usuário Autenticado
```
GET /api/auth/me

Response:
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com"
  }
}
```

### 6. Logout
```
POST /api/auth/logout

Response:
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

### 7. Abrir Case
```
POST /api/cases/:id/open

Exemplo: POST /api/cases/toolbox/open

Response:
{
  "success": true,
  "skin": {
    "id": "uuid",
    "name": "AWP Phobos",
    "rarity": "epic",
    "value": 85.50
  },
  "inventoryItem": { ... },
  "userData": {
    "balance": 88.00
  }
}
```

### 8. Dados Completos do Usuário
```
GET /api/user/data

Response:
{
  "data": {
    "userId": "uuid",
    "balance": 100.50,
    "inventory": [ ... ],
    "transactions": [ ... ]
  }
}
```

### 9. Adicionar Saldo
```
POST /api/user/balance

Body:
{
  "amount": 50.00,
  "description": "Depósito via PIX"
}

Response:
{
  "success": true,
  "data": {
    "balance": 150.50,
    "transaction": { ... }
  }
}
```

### 10. Listar Inventário
```
GET /api/user/inventory

Query Params (opcionais):
- sortBy: "date" | "value" | "rarity"
- order: "ASC" | "DESC"
- rarity: filtrar por raridade

Exemplo: GET /api/user/inventory?sortBy=value&order=DESC

Response:
{
  "inventory": [ ... ],
  "totalValue": 500.00,
  "totalItems": 10
}
```

### 11. Adicionar Item ao Inventário
```
POST /api/user/inventory

Body:
{
  "skinName": "AWP Dragon Lore",
  "skinImage": "/dragon-lore.jpg",
  "rarity": "legendary",
  "caseName": "Ultra Case",
  "caseId": "ultra",
  "value": 500.00
}
```

### 12. Remover Item do Inventário
```
DELETE /api/user/inventory/:itemId

Exemplo: DELETE /api/user/inventory/uuid-do-item

Response:
{
  "success": true,
  "message": "Item removido do inventário"
}
```

### 13. Histórico de Transações
```
GET /api/user/transactions

Query Params (opcionais):
- type: "deposit" | "case_open" | "withdrawal"
- limit: número de resultados (default: 50)
- offset: paginação

Exemplo: GET /api/user/transactions?type=case_open&limit=10

Response:
{
  "transactions": [ ... ],
  "total": 25
}
```

---

## 📊 Resumo das Rotas

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/register` | ❌ | Registrar usuário |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/logout` | ✅ | Logout |
| GET | `/api/auth/me` | ✅ | Dados do usuário autenticado |
| GET | `/api/cases` | ❌ | Listar cases |
| GET | `/api/cases/:id` | ❌ | Detalhes do case |
| POST | `/api/cases/:id/open` | ✅ | Abrir case |
| GET | `/api/user/data` | ✅ | Dados completos do usuário |
| POST | `/api/user/balance` | ✅ | Adicionar saldo |
| GET | `/api/user/inventory` | ✅ | Listar inventário |
| POST | `/api/user/inventory` | ✅ | Adicionar item |
| DELETE | `/api/user/inventory/:itemId` | ✅ | Remover item |
| GET | `/api/user/transactions` | ✅ | Histórico de transações |

**Total:** 13 endpoints

---

## 🔧 Uso do Arquivo de Configuração

### Importar no código:
```typescript
import { API_ROUTES, buildUrl } from './config/routes.config';

// Usar constantes
const loginUrl = buildUrl(API_ROUTES.AUTH.LOGIN.path);
// Result: /api/auth/login

// Com parâmetros
const caseUrl = buildUrl(API_ROUTES.CASES.GET_BY_ID.path, { id: 'toolbox' });
// Result: /api/cases/toolbox

// Com query params
import { buildUrlWithQuery } from './config/routes.config';
const inventoryUrl = buildUrlWithQuery(
  API_ROUTES.USER.GET_INVENTORY.path,
  undefined,
  { sortBy: 'value', order: 'DESC' }
);
// Result: /api/user/inventory?sortBy=value&order=DESC
```

### Listar todas as rotas:
```typescript
import { ALL_ROUTES, PUBLIC_ROUTES, PROTECTED_ROUTES } from './config/routes.config';

console.log('Total de rotas:', ALL_ROUTES.length);
console.log('Rotas públicas:', PUBLIC_ROUTES.length);
console.log('Rotas protegidas:', PROTECTED_ROUTES.length);

// Iterar sobre todas as rotas
ALL_ROUTES.forEach(route => {
  console.log(`${route.method} ${route.path} - ${route.description}`);
});
```

---

## 🧪 Testar com cURL

### Registrar e Login:
```bash
# 1. Registrar
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"senha123"}'

# 2. Login (salve o token!)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"senha123"}'
```

### Usar rotas protegidas:
```bash
# Substitua TOKEN pelo accessToken do login
TOKEN="seu_token_aqui"

# Ver dados do usuário
curl http://localhost:3001/api/user/data \
  -H "Authorization: Bearer $TOKEN"

# Adicionar saldo
curl -X POST http://localhost:3001/api/user/balance \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"description":"Depósito inicial"}'

# Abrir case
curl -X POST http://localhost:3001/api/cases/daily/open \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📖 Documentação Interativa

**Swagger UI:** http://localhost:3001/api/docs

No Swagger você pode:
- ✅ Ver todas as rotas
- ✅ Testar endpoints interativamente
- ✅ Ver schemas de request/response
- ✅ Autenticar com JWT token

---

**Arquivo de configuração:** `src/config/routes.config.ts`  
**Documentação completa:** Este arquivo (ROTAS_API.md)


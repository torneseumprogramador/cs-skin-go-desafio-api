# 🔗 Guia de Integração Frontend → Backend

Este documento mostra como integrar o frontend Next.js com a API NestJS.

## 📝 Configuração Inicial

### 1. Configurar variável de ambiente no frontend

Crie/atualize o arquivo `.env.local` no diretório `front-end`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 2. Atualizar os serviços do frontend

Os serviços já existentes (`services/auth.ts`, `services/cases.ts`, `services/user.ts`) precisam ser atualizados para apontar para a nova API.

---

## 🔄 Mudanças Necessárias

### Arquivo: `front-end/services/auth.ts`

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Login
async login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao fazer login');
  }

  // Salvar token no localStorage
  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
  }

  return data;
}

// Register
async register(name: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao registrar');
  }

  return data;
}

// Get current user
async getMe() {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao buscar usuário');
  }

  return data;
}

// Logout
async logout() {
  const token = localStorage.getItem('accessToken');

  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  localStorage.removeItem('accessToken');
}
```

---

### Arquivo: `front-end/services/cases.ts`

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Listar todos os cases
async getAllCases() {
  const response = await fetch(`${API_URL}/cases`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao buscar cases');
  }

  return data.cases;
}

// Buscar detalhes de um case
async getCaseById(id: string) {
  const response = await fetch(`${API_URL}/cases/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao buscar case');
  }

  return data.case;
}

// Abrir um case
async openCase(caseId: string) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}/cases/${caseId}/open`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao abrir case');
  }

  return data;
}
```

---

### Arquivo: `front-end/services/user.ts`

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Obter dados completos do usuário
async getUserData() {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}/user/data`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao buscar dados do usuário');
  }

  return data.data;
}

// Adicionar saldo
async addBalance(amount: number, description: string) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}/user/balance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ amount, description }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao adicionar saldo');
  }

  return data;
}

// Obter inventário
async getInventory(sortBy?: string, order?: 'ASC' | 'DESC', rarity?: string) {
  const token = localStorage.getItem('accessToken');

  const params = new URLSearchParams();
  if (sortBy) params.append('sortBy', sortBy);
  if (order) params.append('order', order);
  if (rarity) params.append('rarity', rarity);

  const response = await fetch(`${API_URL}/user/inventory?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao buscar inventário');
  }

  return data;
}

// Remover item do inventário
async removeInventoryItem(itemId: string) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_URL}/user/inventory/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao remover item');
  }

  return data;
}

// Obter transações
async getTransactions(type?: string, limit?: number, offset?: number) {
  const token = localStorage.getItem('accessToken');

  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());

  const response = await fetch(`${API_URL}/user/transactions?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Erro ao buscar transações');
  }

  return data;
}
```

---

## 🔑 Gerenciamento de Tokens

### Criar um helper para gerenciar tokens

Crie o arquivo `front-end/lib/auth-token.ts`:

```typescript
export const AuthToken = {
  set: (token: string) => {
    localStorage.setItem('accessToken', token);
  },

  get: () => {
    return localStorage.getItem('accessToken');
  },

  remove: () => {
    localStorage.removeItem('accessToken');
  },

  exists: () => {
    return !!localStorage.getItem('accessToken');
  },
};
```

---

## 🛡️ Tratamento de Erros

### Criar um helper para tratar erros de API

Crie o arquivo `front-end/lib/api-error-handler.ts`:

```typescript
export async function handleApiResponse(response: Response) {
  const data = await response.json();

  if (!response.ok) {
    // Token expirado ou inválido
    if (response.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    throw new Error(data.message || 'Erro na requisição');
  }

  return data;
}

// Uso:
const response = await fetch(`${API_URL}/user/data`, {
  headers: { 'Authorization': `Bearer ${token}` },
});

const data = await handleApiResponse(response);
```

---

## 🔄 Atualizar Context de Autenticação

### `front-end/contexts/auth-context.tsx`

```typescript
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthToken } from '@/lib/auth-token';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = AuthToken.get();

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        AuthToken.remove();
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      AuthToken.remove();
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    AuthToken.set(data.accessToken);
    setUser(data.user);
    router.push('/');

    return data;
  }

  async function logout() {
    const token = AuthToken.get();

    if (token) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    }

    AuthToken.remove();
    setUser(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## 🧪 Testar Integração

### 1. Iniciar o Backend

```bash
cd back-end-api
npm run start:dev
```

### 2. Iniciar o Frontend

```bash
cd front-end
npm run dev
```

### 3. Testar Fluxo Completo

1. ✅ Registrar um novo usuário
2. ✅ Fazer login
3. ✅ Ver lista de cases
4. ✅ Adicionar saldo
5. ✅ Abrir um case
6. ✅ Ver inventário
7. ✅ Ver histórico de transações

---

## 🐛 Troubleshooting

### Erro CORS

Se encontrar erros de CORS, verifique se o backend está configurado corretamente no `main.ts`:

```typescript
app.enableCors({
  origin: 'http://localhost:3000', // URL do frontend
  credentials: true,
});
```

### Token não está sendo enviado

Certifique-se de que está usando `localStorage` para armazenar o token e enviando no header:

```typescript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
}
```

---

## ✅ Checklist de Integração

- [ ] Variável `NEXT_PUBLIC_API_URL` configurada
- [ ] Serviços atualizados para apontar para a API
- [ ] Helper de token criado
- [ ] Context de autenticação atualizado
- [ ] Tratamento de erros implementado
- [ ] Testes realizados em todos os fluxos

---

**Integração completa entre Frontend (Next.js) e Backend (NestJS)! 🚀**


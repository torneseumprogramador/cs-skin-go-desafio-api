/**
 * Configuração centralizada de rotas da API
 * 
 * Este arquivo contém todas as rotas disponíveis na aplicação,
 * permitindo uma visão clara e organizada de todos os endpoints.
 */

export const API_ROUTES = {
  // Prefixo global da API
  PREFIX: 'api',

  // ==========================================
  // AUTH ROUTES - Autenticação
  // ==========================================
  AUTH: {
    BASE: 'auth',
    REGISTER: {
      path: 'auth/register',
      method: 'POST',
      auth: false,
      description: 'Registrar novo usuário',
    },
    LOGIN: {
      path: 'auth/login',
      method: 'POST',
      auth: false,
      description: 'Fazer login e obter token JWT',
    },
    LOGOUT: {
      path: 'auth/logout',
      method: 'POST',
      auth: true,
      description: 'Fazer logout',
    },
    ME: {
      path: 'auth/me',
      method: 'GET',
      auth: true,
      description: 'Obter dados do usuário autenticado',
    },
  },

  // ==========================================
  // CASES ROUTES - Cases/Caixas
  // ==========================================
  CASES: {
    BASE: 'cases',
    LIST: {
      path: 'cases',
      method: 'GET',
      auth: false,
      description: 'Listar todos os cases disponíveis',
    },
    GET_BY_ID: {
      path: 'cases/:id',
      method: 'GET',
      auth: false,
      description: 'Obter detalhes de um case específico com suas skins',
      params: ['id'],
    },
    OPEN: {
      path: 'cases/:id/open',
      method: 'POST',
      auth: true,
      description: 'Abrir um case e receber uma skin aleatória',
      params: ['id'],
    },
  },

  // ==========================================
  // USER ROUTES - Usuário
  // ==========================================
  USER: {
    BASE: 'user',
    GET_DATA: {
      path: 'user/data',
      method: 'GET',
      auth: true,
      description: 'Obter todos os dados do usuário (saldo, inventário, transações)',
    },
    ADD_BALANCE: {
      path: 'user/balance',
      method: 'POST',
      auth: true,
      description: 'Adicionar saldo à conta do usuário',
    },
    GET_INVENTORY: {
      path: 'user/inventory',
      method: 'GET',
      auth: true,
      description: 'Listar inventário do usuário',
      queryParams: ['sortBy', 'order', 'rarity'],
    },
    ADD_INVENTORY_ITEM: {
      path: 'user/inventory',
      method: 'POST',
      auth: true,
      description: 'Adicionar item manualmente ao inventário',
    },
    DELETE_INVENTORY_ITEM: {
      path: 'user/inventory/:itemId',
      method: 'DELETE',
      auth: true,
      description: 'Remover item do inventário',
      params: ['itemId'],
    },
    GET_TRANSACTIONS: {
      path: 'user/transactions',
      method: 'GET',
      auth: true,
      description: 'Listar histórico de transações do usuário',
      queryParams: ['type', 'limit', 'offset'],
    },
  },
} as const;

/**
 * Lista plana de todas as rotas para fácil iteração
 */
export const ALL_ROUTES = [
  // Auth
  API_ROUTES.AUTH.REGISTER,
  API_ROUTES.AUTH.LOGIN,
  API_ROUTES.AUTH.LOGOUT,
  API_ROUTES.AUTH.ME,
  // Cases
  API_ROUTES.CASES.LIST,
  API_ROUTES.CASES.GET_BY_ID,
  API_ROUTES.CASES.OPEN,
  // User
  API_ROUTES.USER.GET_DATA,
  API_ROUTES.USER.ADD_BALANCE,
  API_ROUTES.USER.GET_INVENTORY,
  API_ROUTES.USER.ADD_INVENTORY_ITEM,
  API_ROUTES.USER.DELETE_INVENTORY_ITEM,
  API_ROUTES.USER.GET_TRANSACTIONS,
];

/**
 * Rotas públicas (não requerem autenticação)
 */
export const PUBLIC_ROUTES = ALL_ROUTES.filter(route => !route.auth);

/**
 * Rotas protegidas (requerem autenticação JWT)
 */
export const PROTECTED_ROUTES = ALL_ROUTES.filter(route => route.auth);

/**
 * Helper para construir URL completa
 */
export function buildUrl(path: string, params?: Record<string, string>): string {
  let url = `/${API_ROUTES.PREFIX}/${path}`;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  return url;
}

/**
 * Helper para construir URL com query params
 */
export function buildUrlWithQuery(
  path: string,
  params?: Record<string, string>,
  queryParams?: Record<string, any>,
): string {
  let url = buildUrl(path, params);
  
  if (queryParams && Object.keys(queryParams).length > 0) {
    const query = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });
    url += `?${query.toString()}`;
  }
  
  return url;
}

/**
 * Tipos TypeScript para autocomplete
 */
export type RouteMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RouteConfig {
  path: string;
  method: RouteMethod;
  auth: boolean;
  description: string;
  params?: string[];
  queryParams?: string[];
}


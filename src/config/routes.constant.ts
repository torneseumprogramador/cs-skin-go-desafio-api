/**
 * Constantes de rotas para uso nos controllers
 * 
 * Use estas constantes nos decorators @Controller() e @Get/@Post/@etc
 * para manter consistência entre a configuração e implementação.
 */

export const ROUTE_CONSTANTS = {
  // Prefixo global
  API_PREFIX: 'api',

  // Base paths dos controllers
  AUTH_BASE: 'auth',
  CASES_BASE: 'cases',
  USER_BASE: 'user',

  // Auth endpoints
  AUTH_REGISTER: 'register',
  AUTH_LOGIN: 'login',
  AUTH_LOGOUT: 'logout',
  AUTH_ME: 'me',

  // Cases endpoints
  CASES_OPEN: ':id/open',

  // User endpoints
  USER_DATA: 'data',
  USER_BALANCE: 'balance',
  USER_INVENTORY: 'inventory',
  USER_TRANSACTIONS: 'transactions',
} as const;

/**
 * Exemplo de uso nos controllers:
 * 
 * @Controller(ROUTE_CONSTANTS.AUTH_BASE)
 * export class AuthController {
 *   @Post(ROUTE_CONSTANTS.AUTH_REGISTER)
 *   async register() { ... }
 * }
 */


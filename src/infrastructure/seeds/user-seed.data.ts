import * as bcrypt from 'bcrypt';

export const defaultUserSeed = {
  name: 'teste',
  email: 'teste@teste.com',
  password: '123456', // Será hasheada durante a execução do seed
};

/**
 * Hash da senha para o seed
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}


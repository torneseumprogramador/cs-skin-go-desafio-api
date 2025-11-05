import { User } from '../entities/user.entity';
import { UserData } from '../entities/user-data.entity';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: Partial<User>): Promise<User>;
  save(user: User): Promise<User>;
  createUserData(userData: Partial<UserData>): Promise<UserData>;
  findUserDataByUserId(userId: string): Promise<UserData | null>;
  saveUserData(userData: UserData): Promise<UserData>;
}


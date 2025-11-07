import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { UserData } from '../../domain/entities/user-data.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserData)
    private readonly userDataRepo: Repository<UserData>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }

  async save(user: User): Promise<User> {
    return this.userRepo.save(user);
  }

  async createUserData(userData: Partial<UserData>): Promise<UserData> {
    const data = this.userDataRepo.create(userData);
    return this.userDataRepo.save(data);
  }

  async findUserDataByUserId(userId: string): Promise<UserData | null> {
    return this.userDataRepo.findOne({ where: { userId } });
  }

  async saveUserData(userData: UserData): Promise<UserData> {
    return this.userDataRepo.save(userData);
  }
}



import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
    };
  }
}


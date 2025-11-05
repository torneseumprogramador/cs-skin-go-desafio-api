import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(name: string, email: string, password: string) {
    // Verificar se email já existe
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Validações
    if (!name || !email || !password) {
      throw new BadRequestException('Todos os campos são obrigatórios');
    }

    if (password.length < 6) {
      throw new BadRequestException('Senha deve ter no mínimo 6 caracteres');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // Criar UserData com saldo inicial 0
    await this.userRepository.createUserData({
      userId: user.id,
      balance: 0,
    });

    return {
      success: true,
      message: 'Usuário criado com sucesso',
    };
  }
}


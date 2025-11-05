import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'joao@example.com',
    description: 'Email do usuário',
  })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário',
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  password: string;
}


import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddBalanceDto {
  @ApiProperty({
    example: 50.0,
    description: 'Valor a ser adicionado ao saldo',
  })
  @IsNotEmpty({ message: 'Valor é obrigatório' })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0.01, { message: 'Valor deve ser maior que 0' })
  amount: number;

  @ApiProperty({
    example: 'Depósito via PIX',
    description: 'Descrição da transação',
  })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString()
  description: string;
}



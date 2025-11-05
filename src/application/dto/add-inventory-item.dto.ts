import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum, Min } from 'class-validator';

export class AddInventoryItemDto {
  @ApiProperty({
    example: 'AWP Dragon Lore',
    description: 'Nome da skin',
  })
  @IsNotEmpty({ message: 'Nome da skin é obrigatório' })
  @IsString()
  skinName: string;

  @ApiProperty({
    example: '/dragon-lore.jpg',
    description: 'URL da imagem da skin',
  })
  @IsNotEmpty({ message: 'Imagem da skin é obrigatória' })
  @IsString()
  skinImage: string;

  @ApiProperty({
    example: 'legendary',
    description: 'Raridade da skin',
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
  })
  @IsNotEmpty({ message: 'Raridade é obrigatória' })
  @IsEnum(['common', 'uncommon', 'rare', 'epic', 'legendary'], {
    message: 'Raridade inválida',
  })
  rarity: string;

  @ApiProperty({
    example: 'Ultra Case',
    description: 'Nome da caixa de origem',
  })
  @IsNotEmpty({ message: 'Nome da caixa é obrigatório' })
  @IsString()
  caseName: string;

  @ApiProperty({
    example: 'ultra',
    description: 'ID da caixa de origem',
  })
  @IsNotEmpty({ message: 'ID da caixa é obrigatório' })
  @IsString()
  caseId: string;

  @ApiProperty({
    example: 500.0,
    description: 'Valor estimado do item',
  })
  @IsNotEmpty({ message: 'Valor é obrigatório' })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor deve ser maior ou igual a 0' })
  value: number;
}


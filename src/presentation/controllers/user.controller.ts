import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GetUserDataUseCase } from '../../application/use-cases/user/get-user-data.use-case';
import { AddBalanceUseCase } from '../../application/use-cases/user/add-balance.use-case';
import { GetInventoryUseCase } from '../../application/use-cases/inventory/get-inventory.use-case';
import { AddInventoryItemUseCase } from '../../application/use-cases/inventory/add-inventory-item.use-case';
import { RemoveInventoryItemUseCase } from '../../application/use-cases/inventory/remove-inventory-item.use-case';
import { GetTransactionsUseCase } from '../../application/use-cases/transactions/get-transactions.use-case';
import { AddBalanceDto } from '../../application/dto/add-balance.dto';
import { AddInventoryItemDto } from '../../application/dto/add-inventory-item.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../../domain/entities/user.entity';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly getUserDataUseCase: GetUserDataUseCase,
    private readonly addBalanceUseCase: AddBalanceUseCase,
    private readonly getInventoryUseCase: GetInventoryUseCase,
    private readonly addInventoryItemUseCase: AddInventoryItemUseCase,
    private readonly removeInventoryItemUseCase: RemoveInventoryItemUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
  ) {}

  @Get('data')
  @ApiOperation({ summary: 'Obter todos os dados do usuário (saldo, inventário, transações)' })
  @ApiResponse({ status: 200, description: 'Dados retornados com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getUserData(@CurrentUser() user: User) {
    return this.getUserDataUseCase.execute(user.id);
  }

  @Post('balance')
  @ApiOperation({ summary: 'Adicionar saldo à conta do usuário' })
  @ApiResponse({ status: 200, description: 'Saldo adicionado com sucesso' })
  @ApiResponse({ status: 400, description: 'Valor inválido' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async addBalance(@CurrentUser() user: User, @Body() addBalanceDto: AddBalanceDto) {
    return this.addBalanceUseCase.execute(user.id, addBalanceDto.amount, addBalanceDto.description);
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Listar inventário do usuário' })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['date', 'value', 'rarity'] })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'rarity', required: false })
  @ApiResponse({ status: 200, description: 'Inventário retornado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getInventory(
    @CurrentUser() user: User,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('rarity') rarity?: string,
  ) {
    return this.getInventoryUseCase.execute(user.id, sortBy, order, rarity);
  }

  @Post('inventory')
  @ApiOperation({ summary: 'Adicionar manualmente um item ao inventário' })
  @ApiResponse({ status: 201, description: 'Item adicionado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async addInventoryItem(@CurrentUser() user: User, @Body() addItemDto: AddInventoryItemDto) {
    return this.addInventoryItemUseCase.execute(user.id, addItemDto);
  }

  @Delete('inventory/:itemId')
  @ApiOperation({ summary: 'Remover item do inventário' })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  @ApiResponse({ status: 403, description: 'Item não pertence ao usuário' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async deleteInventoryItem(@CurrentUser() user: User, @Param('itemId') itemId: string) {
    return this.removeInventoryItemUseCase.execute(user.id, itemId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Listar histórico de transações do usuário' })
  @ApiQuery({ name: 'type', required: false, enum: ['deposit', 'case_open', 'withdrawal'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Transações retornadas com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getTransactions(
    @CurrentUser() user: User,
    @Query('type') type?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.getTransactionsUseCase.execute(user.id, type, limit, offset);
  }
}


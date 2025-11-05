import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ListCasesUseCase } from '../../application/use-cases/cases/list-cases.use-case';
import { GetCaseDetailsUseCase } from '../../application/use-cases/cases/get-case-details.use-case';
import { OpenCaseUseCase } from '../../application/use-cases/cases/open-case.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../../domain/entities/user.entity';

@ApiTags('cases')
@Controller('cases')
export class CasesController {
  constructor(
    private readonly listCasesUseCase: ListCasesUseCase,
    private readonly getCaseDetailsUseCase: GetCaseDetailsUseCase,
    private readonly openCaseUseCase: OpenCaseUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os cases disponíveis' })
  @ApiResponse({ status: 200, description: 'Lista de cases retornada com sucesso' })
  async findAll() {
    return this.listCasesUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um case específico incluindo skins' })
  @ApiResponse({ status: 200, description: 'Detalhes do case retornados com sucesso' })
  @ApiResponse({ status: 404, description: 'Case não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.getCaseDetailsUseCase.execute(id);
  }

  @Post(':id/open')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Abrir um case e receber uma skin aleatória' })
  @ApiResponse({ status: 200, description: 'Case aberto com sucesso' })
  @ApiResponse({ status: 400, description: 'Saldo insuficiente' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Case não encontrado' })
  async openCase(@CurrentUser() user: User, @Param('id') id: string) {
    return this.openCaseUseCase.execute(user.id, id);
  }
}


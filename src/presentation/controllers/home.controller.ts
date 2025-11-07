import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class HomeController {
  @Get()
  @ApiOperation({ summary: 'Informações do sistema' })
  @ApiResponse({
    status: 200,
    description: 'Retorna informações sobre a API e links úteis',
  })
  getInfo() {
    const port = process.env.PORT || 3001;
    const apiPrefix = process.env.API_PREFIX || 'api';
    const baseUrl = `http://localhost:${port}`;

    return {
      name: 'CS Skin GO API',
      version: '1.0.0',
      description: 'API para plataforma de abertura de cases de CS:GO/CS2',
      architecture: 'Onion Architecture',
      framework: 'NestJS',
      database: 'MySQL',
      environment: process.env.NODE_ENV || 'development',
      status: 'online',
      timestamp: new Date().toISOString(),
      documentation: `${baseUrl}/${apiPrefix}/docs`,
    };
  }
}


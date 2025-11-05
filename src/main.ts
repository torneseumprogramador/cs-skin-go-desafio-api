import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './presentation/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração global do prefixo da API
  const apiPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(apiPrefix);

  // Segurança
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Filtro global de exceções
  app.useGlobalFilters(new AllExceptionsFilter());

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('CS Skin GO API')
    .setDescription('API para plataforma de abertura de cases de CS:GO/CS2')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação de usuários')
    .addTag('cases', 'Gerenciamento de cases')
    .addTag('user', 'Dados e operações do usuário')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 API rodando em: http://localhost:${port}/${apiPrefix}`);
  console.log(`📖 Documentação Swagger: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();


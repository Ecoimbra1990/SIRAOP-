import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Habilitar ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar prefixo global da API
  app.setGlobalPrefix('api');

  // Rodar na porta 8080 (padrão do Cloud Run)
  const port = process.env.PORT || 8080;
  await app.listen(port);
  
  console.log(`🚀 SIRAOP API rodando na porta ${port}`);
}

bootstrap();

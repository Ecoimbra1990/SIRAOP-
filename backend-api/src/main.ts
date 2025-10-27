import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://siraop-frontend.web.app',
      'https://siraop-frontend.firebaseapp.com',
      'https://siraop-public.vercel.app',
      'https://siraop-public-nqhhvj0yq-ecoimbra1990s-projects.vercel.app',
      'https://frontend-pwa.vercel.app',
      'https://*.vercel.app',
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
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

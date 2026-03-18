import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS for frontend
  app.enableCors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' });

  // Swagger API docs
  const config = new DocumentBuilder()
    .setTitle('Eco-Game API')
    .setDescription('Backend for the blockchain-based environmental sustainability game')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🌱 Eco-Game backend running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();

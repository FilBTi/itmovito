import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import 'dotenv/config';
import { swaggerDocs } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ZodValidationPipe());

  SwaggerModule.setup('api', app, swaggerDocs(app));

  await app.listen(3000, '0.0.0.0');
}
bootstrap();

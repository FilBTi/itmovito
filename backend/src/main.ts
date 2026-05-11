import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import 'dotenv/config';
import { swaggerDocs } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin:
      corsOrigins.length > 0
        ? corsOrigins
        : [
            'http://localhost:3030',
            'http://127.0.0.1:3030',
            'http://localhost:3031',
            'http://127.0.0.1:3031',
          ],
    credentials: true,
  });

  app.useGlobalPipes(new ZodValidationPipe());

  SwaggerModule.setup('api', app, swaggerDocs(app));

  await app.listen(3000, '0.0.0.0');
}
bootstrap();

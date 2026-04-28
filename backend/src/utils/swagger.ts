import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

export const swaggerDocs = (app: INestApplication<any>): OpenAPIObject => {
  const config = new DocumentBuilder()
    .setTitle('Itmovito API')
    .setVersion('1.0')
    .build();
  const document = cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));
  return document;
};

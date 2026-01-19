import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Global API prefix
   */
  const apiPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  /**
   * Enable CORS
   */
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  /**
   * Global validation pipe
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  /**
   * Swagger configuration
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'KUM Management API')
    .setDescription(
      process.env.SWAGGER_DESCRIPTION ||
        'API documentation for KUM Management System',
    )
    .setVersion(process.env.SWAGGER_VERSION || '1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  /**
   * Start server
   */
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 Swagger docs on http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();

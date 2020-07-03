import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

/**
 * la funcion que corre el servidor
 */
async function bootstrap() {
  // crea un logger
  const logger = new Logger('bootstrap');

  // crea el app de nest con entrada en appmodule
  const port = 3000;
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();

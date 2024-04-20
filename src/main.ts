import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: '*',
    credentials: true,
    preflightContinue: false,
    methods: ['GET', 'POST', 'PUT', 'HEAD', 'PATCH', 'DELETE'],
  });

  await app.listen(3000);
}
bootstrap();

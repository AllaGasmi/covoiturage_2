import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.use(require('express').json()); 
  app.use(require('express').urlencoded({ extended: true })); 


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(3000);
  console.log(' App running on http://localhost:3000');
  console.log(' GraphQL on http://localhost:3000/graphql');
}
bootstrap();

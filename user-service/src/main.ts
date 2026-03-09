import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  //  app.use((req: Request, res: Response, next: NextFunction) => {
  //   const consumerId = req.headers['x-consumer-id'];
  //   console.log(consumerId)

  //   if (!consumerId) {
  //     return res.status(401).json({
  //       error: 'Unauthorized: Request must come through gateway',
  //     });
  //   }
  //   next();
  // });

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin === 'http://localhost:8000') {
        callback(null, true);
      } else {
        callback(new Error('Only gateway allowed'));
      }
    },
  });

  app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();

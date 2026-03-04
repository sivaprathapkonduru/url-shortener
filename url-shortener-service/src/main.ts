import { NestFactory } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API Key Interceptor
  app.use((req: Request, res: Response, next: NextFunction) => {
    const apikey = req.headers['apikey'] as string;

    if (!apikey || apikey !== 'my-secret-api-key') {
      return res.status(401).json({ error: 'API key required' });
    }
    next();
  });

  const corsOptions: CorsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || origin === 'http://localhost:8000') {
        callback(null, true);
      } else {
        callback(new Error('Only gateway allowed'));
      }
    },
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API Key Interceptor
  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   const apikey = req.headers['apikey'] as string;

  //   if (!apikey || apikey !== 'my-secret-api-key') {
  //     return res.status(401).json({ error: 'API key required' });
  //   }
  //   next();
  // });

  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   console.log(`Incoming request: ${req} ${req.url}`);
  //   const consumerId = req.headers['x-consumer-id'];

  //   if (!consumerId) {
  //     return res.status(401).json({
  //       error: 'Unauthorized: Request must come through gateway',
  //     });
  //   }
  //   next();
  // });
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'url_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'url',
      protoPath: 'proto/url.proto',
      url: '0.0.0.0:50051',
    },
  });

  await app.startAllMicroservices();

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

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

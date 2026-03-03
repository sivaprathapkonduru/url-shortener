import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin === 'http://localhost:8000') {
        callback(null, true);
      } else {
        callback(new Error('Only gateway allowed'));
      }
    },
  });
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();

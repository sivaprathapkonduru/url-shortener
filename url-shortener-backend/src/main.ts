import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API Key Interceptor
  app.use((req, res, next) => {
    const apikey = req.headers['apikey'];
    
    if (!apikey || apikey !== 'my-secret-api-key') {
      return res.status(401).json({ error: 'API key required' });
    }
    next();
  });

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || origin === 'http://localhost:8000') {
        callback(null, true);
      } else {
        callback(new Error('Only gateway allowed'));
      }
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

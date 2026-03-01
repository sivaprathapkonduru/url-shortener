import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlShortenerModule } from './url-shortener/url-shortener.module';
import configuration from 'config/configuration';
import { DatabaseModule } from './databases/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: true,
      load: [configuration],
    }), UrlShortenerModule,
    DatabaseModule
  ],
})
export class AppModule { }

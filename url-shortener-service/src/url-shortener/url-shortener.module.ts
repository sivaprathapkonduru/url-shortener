import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/databases/database.module';
import { URLController } from './url.controller';
import { URLService } from './services/url-shortener.service';
import { urlProviders } from './providers/url.providers';
import { RedisModule } from 'src/common/redis/redis.module';


@Module({
    imports: [
        DatabaseModule,
        RedisModule
    ],
    controllers: [URLController],
    providers: [
        URLService,
        ...urlProviders
    ],
})
export class UrlShortenerModule {}

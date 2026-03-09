import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UrlShortenerModule } from './url-shortener/url-shortener.module';
import configuration from 'config/configuration';
import { DatabaseModule } from './databases/database.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    UrlShortenerModule,
    DatabaseModule,
    HttpModule,
  ],
})
export class AppModule {}

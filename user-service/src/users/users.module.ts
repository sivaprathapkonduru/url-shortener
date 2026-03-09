import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path/win32';

@Module({
  imports: [PrismaModule, HttpModule,
    ClientsModule.register([
      {
        name: 'URL_SERVICE_RMQ',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: 'url_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'URL_SERVICE_GRPC',
        transport: Transport.GRPC,
        options: {
          package: 'url',
          // protoPath: join(__dirname, '../proto/url.proto'),
          protoPath: 'proto/url.proto',
          url: 'url-shortener-service:50051',
        },
      },
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}

import { Injectable, BadRequestException, Inject, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ClientProxy } from '@nestjs/microservices';
import type { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';

interface UrlService {
    createShortURLGrpc(data: { url: string }): any;
}

@Injectable()
export class UsersService implements OnModuleInit {

    private urlService: UrlService;

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
        @Inject('URL_SERVICE_RMQ')
        private readonly urlClient: ClientProxy,

        @Inject('URL_SERVICE_GRPC')
        private readonly client: ClientGrpc,
    ) { }

    onModuleInit() {
        this.urlService = this.client.getService<UrlService>('UrlService');
    }

    async create(request: CreateUserDto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: request.email },
        });

        if (existing) {
            throw new BadRequestException('Username already exists');
        }

        request.password = await bcrypt.hash(request.password, 10);
        // const urlResponse = await firstValueFrom(this.httpService.post('http://url-service:3000/urls/create', {
        //     url: `http://user-service:3001/users/${request.id}`,
        // }));
        const userResponse = await this.prisma.user.create({
            data: {
                name: request.name,
                password: request.password,
                email: request.email,
                id: request.id
            },
        })
        this.urlClient.emit('create_short_url', {
            url: `http://user-service:3001/users/${request.id}${new Date().getTime()}`,
        });

        // const getURLValue = await firstValueFrom(this.httpService.get('http://url-service:3000/urls/' + urlResponse.data._id));
        return { userResponse };
    }


    //   async login(username: string, password: string) {
    //     const user = await this.prisma.user.findUnique({
    //       where: { name: username },
    //     });

    //     if (!user) {
    //       throw new BadRequestException('User not found');
    //     }

    //     const match = await bcrypt.compare(password, user.password);

    //     if (!match) {
    //       throw new BadRequestException('Invalid password');
    //     }

    //     return { message: 'Login successful', userId: user.id };
    //   }

    findAll(): any {
        return this.prisma.user.findMany({
            select: { id: true, name: true },
        });
    }

    async sendURLCreationWithGraphQL(url: string) {
        const response = await firstValueFrom(this.httpService.post('http://url-service:3000/graphql', {
            query: `
        mutation {
          createShortUrl(body: { url: "${url}" }) {
            id
            url
          }
        }
      `,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        }));
        return response.data;
    };

    async getURLWithGraphQL() {
        console.log('Sending GraphQL query to URL service');
        const response = await firstValueFrom(
            this.httpService.post(
                'http://url-shortener-service:3000/graphql',
                {
                    query: `
        query {
          healthCheck
        }
      `,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            ),
        );
        return response.data.data;
    };

    async createURLWithGrpc(url: string) {
        const response = await this.urlService.createShortURLGrpc({
            url
        }).toPromise();
        console.log('Received response from gRPC URL service:', response);

        return response;
    }
}
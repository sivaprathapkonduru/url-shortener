import { Controller, Post, Get, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    @Post()
    create(@Body() body: CreateUserDto) {
        return this.usersService.create(body);
    }

    //   @Get()
    //   findAll() {
    //     return this.usersService.findAll();
    //   }

    //   @Get(':id')
    //   findOne(@Param('id') id: string) {
    //     return this.usersService.findOne(id);
    //   }

    @Post('url-creation')
    async createURL(@Body() body: { url: string }) {
        return await this.usersService.sendURLCreationWithGraphQL(body.url);
    }

    @Get("get-health-check")
    async healthCheckForGrapgQl(): Promise<any> {
        return await this.usersService.getURLWithGraphQL();
    }

    @Post("create-url-with-grpc")
    async createURLWithGRPC(@Body() body: { url: string }) {
        return await this.usersService.createURLWithGrpc(body.url);
    }
}
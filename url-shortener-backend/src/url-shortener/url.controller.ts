
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { URLService } from './services/url-shortener.service';
import { URL } from './interfaces/url.interface';

@Controller('urls')
export class URLController {
    constructor(private urlService: URLService) { }

    @Post('/create')
    async create(@Body() body: { url: string }): Promise<URL> {
        return this.urlService.create(body);
    }

    @Get()
    async findAll(): Promise<URL[]> {
        return this.urlService.findAll();
    }
}
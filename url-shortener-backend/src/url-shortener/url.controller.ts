
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { URLService } from './services/url-shortener.service';
import { URL } from './interfaces/url.interface';

@Controller('urls')
export class URLController {
    constructor(private readonly urlService: URLService) {
     }

    @Post('/create')
    async create(@Body() body: { url: string }): Promise<URL> {
        return this.urlService.create(body);
    }

    @Get()
    async findAll(): Promise<URL[]> {
        return this.urlService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<URL | null> {
        return this.urlService.findOne(id);
    }
}
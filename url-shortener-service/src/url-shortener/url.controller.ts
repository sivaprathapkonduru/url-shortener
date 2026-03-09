import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { URLService } from './services/url-shortener.service';
import { URL } from './interfaces/url.interface';
import { EventPattern, GrpcMethod } from '@nestjs/microservices';

@Controller('urls')
export class URLController {
  constructor(private readonly urlService: URLService) {}

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

  @EventPattern('create_short_url')
  async createShortURL(@Body() body: { url: string }): Promise<URL> {
    // console.log('Received event to create short URL for:', body);
    return this.urlService.create(body);
  }

  @GrpcMethod('UrlService', 'createShortURLGrpc')
  async createShortURLGrpc(data: { url: string }): Promise<URL> {
    const res = await this.urlService.create(data);
    console.log('Created short URL via gRPC:', res);
    return res;
  }
}

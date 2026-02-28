import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Validator } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { URL } from '../interfaces/url.interface';
import { CreateURLShortenerDto } from '../dto/url-shortner.dto';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class URLService {
  private readonly validator = new Validator();

  constructor(
    @Inject('URL_MODEL')
    private readonly urlModel: Model<URL>,
    private readonly redisService: RedisService,
  ) {}

  async create(createURLDto: any): Promise<URL> {  // Accept plain object
    const dto = plainToClass(CreateURLShortenerDto, createURLDto);
    const errors = await this.validator.validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid URL: ' + JSON.stringify(errors));
    }

    const created = new this.urlModel(dto);
    await this.redisService.set(created._id.toString(), created.url);
    return created.save();
  }

  async findAll(): Promise<URL[]> {
    return this.urlModel.find().exec();
  }

  async findOne(id: string): Promise<URL | null> {
    const chachedURL = await this.redisService.get(id);
    if(chachedURL) {
      return { _id: id, url: chachedURL } as unknown as URL;
    }
    return this.urlModel.findById(id).exec();
  }
}

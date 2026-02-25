import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Validator } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { URL } from '../interfaces/url.interface';
import { CreateURLShortenerDto } from '../dto/url-shortner.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class URLService {
  private validator = new Validator();

  constructor(
    @Inject('URL_MODEL')
    private urlModel: Model<URL>,
  ) {}

  async create(createURLDto: any): Promise<URL> {  // Accept plain object
    const dto = plainToClass(CreateURLShortenerDto, createURLDto);
    const errors = await this.validator.validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException('Invalid URL: ' + JSON.stringify(errors));
    }

    const created = new this.urlModel(dto);
    return created.save();
  }

  async findAll(): Promise<URL[]> {
    return this.urlModel.find().exec();
  }
}

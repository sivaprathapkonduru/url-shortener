import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { URLService } from './services/url-shortener.service';
import { CreateUrlInput, Url } from './models/url.model';

@Resolver(() => Url)
export class UrlsResolver {
  constructor(private readonly urlsService: URLService) {}

  @Query(() => String)
  healthCheck() {
    return 'URL Service GraphQL running';
  }

  @Mutation(() => Url)
  async createShortUrl(@Args('body') body: CreateUrlInput) {
    return this.urlsService.create(body);
  }
}

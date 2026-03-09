import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { IsUrl } from 'class-validator';

@ObjectType()
export class Url {
  @Field(() => ID)
  id: string;

  @Field()
  url: string;

  // @Field()
  // shortCode: string;
}

@InputType()
export class CreateUrlInput {
  @Field()
  @IsUrl()
  url: string;
}

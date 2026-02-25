// create-user.dto.ts
import { IsString, MinLength, MaxLength,  } from 'class-validator';

export class CreateURLShortenerDto {
  @IsString()
  // @MinLength(30, { message: 'Name too short' })
  url: string;
}
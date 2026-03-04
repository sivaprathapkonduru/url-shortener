// create-user.dto.ts
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateURLShortenerDto {
  @IsString()
  @MinLength(30, { message: 'URL too short' })
  @MaxLength(2048, { message: 'URL too long' })
  url: string;
}

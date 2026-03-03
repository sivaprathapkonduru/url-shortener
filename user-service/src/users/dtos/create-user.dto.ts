import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    id?: string = crypto.randomUUID();

    @IsString()
    email: string;

    @IsString()
    name: string;

    @IsString()
    @MinLength(6)
    password: string;
}

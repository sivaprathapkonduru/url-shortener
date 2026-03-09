import { IsString, MinLength, IsUUID } from 'class-validator';

export class CreateUserDto {
    @IsUUID()
    id?: string = crypto.randomUUID();

    @IsString()
    email: string;

    @IsString()
    // @IsEmpty({ message: 'Username should not be provided' })
    name: string;

    @IsString()
    @MinLength(6)
    password: string;
}

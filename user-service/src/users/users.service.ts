import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(request: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: request.email },
    });

    if (existing) {
      throw new BadRequestException('Username already exists');
    }

    request.password = await bcrypt.hash(request.password, 10);

    return this.prisma.user.create({
      data: {
        name: request.name,
        password: request.password,
        email: request.email,
        id: request.id,
      },
    });
  }

  
//   async login(username: string, password: string) {
//     const user = await this.prisma.user.findUnique({
//       where: { name: username },
//     });

//     if (!user) {
//       throw new BadRequestException('User not found');
//     }

//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       throw new BadRequestException('Invalid password');
//     }

//     return { message: 'Login successful', userId: user.id };
//   }

//   findAll() {
//     return this.prisma.user.findMany({
//       select: { id: true, username: true },
//     });
//   }
}
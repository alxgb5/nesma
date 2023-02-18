import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }
  createOrUpdate(userDto: UserDto) {
    return this.prisma.user.upsert({
      where: { email: userDto.email },
      create: userDto,
      update: userDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany({ where: { enabled: true } });
  }

  findOne(id: number) {
    return this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}

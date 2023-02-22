import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './user.dto';
import { MainHelpers } from '../../core/tools/main-helper';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }
  async createOrUpdate(userDto: UserDto) {
    const hashedPassword = await MainHelpers.hashPassword(userDto.password);
    return this.prisma.user.upsert({
      where: { email: userDto.email },
      create: {
        email: userDto.email,
        firstname: userDto.firstname,
        lastname: userDto.lastname,
        password: hashedPassword,
        enabled: userDto.enabled,
        roles: {
          connect: userDto.roles.map((role) => ({ name: role.code })),
        }
      },
      update: {
        id: userDto.id,
        email: userDto.email,
        firstname: userDto.firstname,
        lastname: userDto.lastname,
        password: userDto.password,
        enabled: userDto.enabled,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({ where: { enabled: true } });
  }

  findOne(id: number) {
    return this.prisma.user.findUniqueOrThrow({ where: { id }, include: { roles: true } });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}

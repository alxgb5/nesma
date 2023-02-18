import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }
  createOrUpdate(userDto: UserDto) {
    const roleObjects = userDto.roles.map(role => ({ role: { connect: { name: role } } }));
    return this.prisma.user.upsert({
      where: { email: userDto.email },
      create: {
        email: userDto.email,
        firstname: userDto.firstname,
        lastname: userDto.lastname,
        password: userDto.password,
        enabled: userDto.enabled,
        roles: {
          create: roleObjects,
        },
      },
      update: {
        id: userDto.id,
        email: userDto.email,
        firstname: userDto.firstname,
        lastname: userDto.lastname,
        password: userDto.password,
        enabled: userDto.enabled,
        roles: {
          create: roleObjects,
        },
      },
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

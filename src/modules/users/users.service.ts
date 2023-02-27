import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetUser, GetUsers, UserDto } from './user.dto';
import { MainHelpers } from '../../core/tools/main-helper';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }
  async createOrUpdate(userDto: UserDto): Promise<GetUser> {
    const response = new GetUser();
    try {
      const hashedPassword = await MainHelpers.hashPassword(userDto.password);
      const action = await this.prisma.user.upsert({
        where: { email: userDto.email },
        create: {
          email: userDto.email,
          firstname: userDto.firstname,
          lastname: userDto.lastname,
          password: hashedPassword,
          enabled: userDto.enabled,
          roles: {
            connect: userDto.roles?.map((role) => ({ code: role.code })),
          }
        },
        update: {
          id: userDto.id,
          email: userDto.email,
          firstname: userDto.firstname,
          lastname: userDto.lastname,
          password: userDto.password,
          enabled: userDto.enabled,
          roles: {
            connect: userDto.roles?.map((role) => ({ code: role.code })),
          }
        },
        include: { roles: true },
      });
      response.data = action;
      response.success = true;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create or update user: ${error.message}`);
    }
    return response;
  }

  async findAll(): Promise<GetUsers> {
    const response = new GetUsers();
    try {
      const action = await this.prisma.user.findMany({
        where: { enabled: true },
        select: {
          refreshToken: false,
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          roles: true,
          password: false,
          createdAt: true,
          updatedAt: true,
        },
      });
      response.data = action;
      response.success = true;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to find users: ${error.message}`);
    }
    return response;
  }

  async findOne(id: number): Promise<GetUser> {
    const response = new GetUser();
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
        include: { roles: true },
      });

      response.data = user;
      response.success = true;
    } catch (error) {
      throw new NotFoundException(`Failed to find user: ${error.message}`);
    }
    return response;
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.prisma.user.delete({ where: { id } });
  }
}


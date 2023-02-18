import { Injectable } from '@nestjs/common';
import { RoleDto } from './role.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(
    private prisma: PrismaService,
  ) {

  }
  createOrUpdate(roleDto: RoleDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}

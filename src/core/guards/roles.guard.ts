import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
    constructor(
        private readonly reflector: Reflector,
        jwtService: JwtService,
        prisma: PrismaService,
    ) {
        super(jwtService, prisma);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        return await super.canAccessForRole(context, roles);
    }
}

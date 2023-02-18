import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest, AuthResponse } from './auth-request.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {
    }

    async login(requestModel: AuthRequest): Promise<AuthResponse> {
        const user = await this.prisma.user.findUnique({
            where: { email: requestModel.email },
        });

        if (!user) {
            throw new NotFoundException('Email is not registered');
        }

        const isPasswordValid = await this.comparePassword(requestModel.password, user.password);

        if (!isPasswordValid) {
            throw new NotFoundException('Password is not correct');
        }

        if (!user.enabled) {
            throw new NotFoundException('Account is not enabled');
        }

        return {
            accessToken: "todo",
            refreshToken: "todo",
        };
    }

    async register() { }

    async refresh() { }

    async logout() { }


    comparePassword(password: string, hash: string) {
        return compare(password, hash);
    }
}
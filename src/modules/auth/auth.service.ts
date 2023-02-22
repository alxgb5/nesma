import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest, AuthResponse } from './auth-request.dto';
import { compare } from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Environment } from '../../core/environments';
import { JwtPayload } from '../../core/types/payload';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/user.dto';
import { RolesList } from '../../core/types/enums';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private userService: UsersService
    ) {
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

        const refreshToken = this.jwtService.sign(user, { secret: Environment.REFRESH_TOKEN_SECRET });

        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: refreshToken },
        });

        return {
            accessToken: this.jwtService.sign(user, { secret: Environment.ACCESS_TOKEN_SECRET }),
            refreshToken: this.jwtService.sign(user, { secret: Environment.REFRESH_TOKEN_SECRET }),
        };
    }

    async register(request: AuthRequest): Promise<AuthResponse> {
        console.log("🚀 ~ AuthService ~ register ~ request:", request);
        const response: AuthResponse = new AuthResponse();

        if (!request.email || !request.password) {
            throw new BadRequestException('Email or password is not provided');
        }

        if (!request.firstname || !request.lastname) {
            throw new BadRequestException('Firstname or lastname is not provided');
        }

        const user = await this.prisma.user.findUnique({ where: { email: request.email } });

        if (user?.id) {
            throw new BadRequestException('Email is already registered');
        }

        const userRole = await this.prisma.userRole.findUnique({ where: { code: RolesList.user } });

        const newUser = new UserDto();
        newUser.email = request.email;
        newUser.password = request.password;
        newUser.firstname = request.firstname;
        newUser.lastname = request.lastname;

        const _newUser = await this.userService.createOrUpdate(newUser);
        await this.prisma.user.update({ where: { id: _newUser.id }, data: { roles: { connect: { code: RolesList.user } } } });

        const payload: JwtPayload = {
            id: _newUser.id.toLocaleString(),
            email: _newUser.email,
            firstname: _newUser.firstname,
            lastname: _newUser.lastname,
            roles: [userRole.code],
            enabled: _newUser.enabled,
        };


        return {
            accessToken: this.jwtService.sign(payload, { secret: Environment.ACCESS_TOKEN_SECRET, }),
            refreshToken: this.jwtService.sign(payload, { secret: Environment.REFRESH_TOKEN_SECRET }),
        };;
    }

    async refresh() { }

    async logout() { }


    comparePassword(password: string, hash: string) {
        return compare(password, hash);
    }
}
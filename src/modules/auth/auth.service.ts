import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRequest, AuthResponse, LoginRequest } from './auth-request.dto';
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

    async login(requestModel: LoginRequest): Promise<AuthResponse> {
        const user = await this.prisma.user.findUnique({
            where: { email: requestModel.email }, include: { roles: true },
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

        const payload: JwtPayload = {
            id: user.id.toLocaleString(),
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            roles: [user.roles.map((role) => role.code).toString()],
            enabled: user.enabled,
        };

        const refreshToken = this.jwtService.sign(payload, { secret: Environment.REFRESH_TOKEN_SECRET });

        await this.prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: refreshToken },
        });

        return {
            accessToken: this.jwtService.sign(payload, { secret: Environment.ACCESS_TOKEN_SECRET }),
            refreshToken: refreshToken,
            success: true,
        };
    }

    async register(request: AuthRequest): Promise<AuthResponse> {
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
        newUser.enabled = true;
        newUser.roles = [{ code: userRole.code }];

        const _newUser = await this.userService.createOrUpdate(newUser);

        const payload: JwtPayload = {
            id: _newUser.id.toLocaleString(),
            email: _newUser.email,
            firstname: _newUser.firstname,
            lastname: _newUser.lastname,
            roles: [userRole.code],
            enabled: _newUser.enabled,
        };

        const refreshToken = this.jwtService.sign(payload, { secret: Environment.REFRESH_TOKEN_SECRET });
        await this.prisma.user.update({
            where: { id: _newUser.id },
            data: { refreshToken: refreshToken },
        });

        response.accessToken = this.jwtService.sign(payload, { secret: Environment.ACCESS_TOKEN_SECRET });
        response.refreshToken = refreshToken;
        // response.success = true;
        return response;
    }

    async refresh() { }

    async logout() { }


    comparePassword(password: string, hash: string) {
        return compare(password, hash);
    }
}
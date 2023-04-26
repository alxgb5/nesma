import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { PrismaService } from '../prisma/prisma.service';
import {
  AuthRequest,
  AuthResponse,
  ForgotPasswordModel,
  LoginRequest,
  RegisterResponse,
  ResetPasswordModel,
} from './auth-request.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, TokenResponse } from '../../core/types/payload';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/user.dto';
import { RolesList } from '../../core/types/enums';
import { GenericResponse } from '../../core/types/responses';
import { MainHelpers } from '../../core/tools/main-helper';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UsersService,
  ) { }

  async login(requestModel: LoginRequest): Promise<AuthResponse> {
    const response = new AuthResponse();
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: requestModel.email },
        include: {
          roles: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Email is not registered');
      }

      const isPasswordValid = await this.comparePassword(
        requestModel.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new NotFoundException('Password is not correct');
      }

      if (!user.enabled) {
        throw new NotFoundException(
          'Account is not enabled. Please enable your account',
        );
      }

      const tokens = await this.generateToken(user);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: tokens.refreshToken },
      });

      response.accessToken = tokens.accesToken;
      response.refreshToken = tokens.refreshToken;
      response.success = true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return response;
  }

  async register(request: AuthRequest): Promise<RegisterResponse> {
    const response = new RegisterResponse();
    try {
      if (
        !request.user.email ||
        !request.user.password ||
        !request.user.firstname ||
        !request.user.lastname
      ) {
        throw new BadRequestException('User data is not completed');
      }

      const user = await this.prisma.user.findUnique({
        where: { email: request.user.email },
      });

      if (user?.id) {
        throw new BadRequestException('Email is already registered');
      }

      const userRole = await this.prisma.userRole.findUnique({
        where: { code: RolesList.user },
      });

      const newUser = new UserDto();
      newUser.email = request.user.email;
      newUser.password = request.user.password;
      newUser.firstname = request.user.firstname;
      newUser.lastname = request.user.lastname;
      newUser.username = request.user.firstname + ' ' + request.user.lastname;
      newUser.activateAccountToken = randomStringGenerator();
      newUser.enabled = false;
      newUser.roles = [{ code: userRole.code }];

      const _createUserResponse = await this.userService.create(newUser);

      // await this.mailService.sendActiveAccountMail(newUser).catch(() => {
      //   throw new BadRequestException('Error occured while sending mail');
      // });

      const tokens = await this.generateToken(_createUserResponse.data);

      await this.prisma.user.update({
        where: { id: _createUserResponse.data.id },
        data: { refreshToken: tokens.refreshToken },
      });

      response.accessToken = tokens.accesToken;
      response.refreshToken = tokens.refreshToken;
      response.user = _createUserResponse.data;
      response.success = true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return response;
  }

  async refresh(token: string): Promise<AuthResponse> {
    const response = new AuthResponse();
    try {
      const user = this.jwtService.decode(token) as JwtPayload;

      if (!user.id) throw new BadRequestException('Bad request');

      const findUser = await this.prisma.user.findFirst({
        where: { refreshToken: token },
        include: { roles: true },
      });

      if (!findUser?.id || findUser.enabled === false)
        throw new ForbiddenException('Access denied');

      const tokens = await this.generateToken(findUser);
      findUser.refreshToken = tokens?.refreshToken;

      const _save = await this.userService.update(findUser);
      if (!_save.success)
        throw new InternalServerErrorException('Unable to update user token');

      response.refreshToken = tokens.refreshToken;
      response.accessToken = tokens.accesToken;
      response.success = true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    console.log('🚀 ~ AuthService ~ refresh ~ response:', response);
    return response;
  }

  async logout(payload: JwtPayload): Promise<GenericResponse> {
    const response = new GenericResponse();
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });
      if (!user) throw new BadRequestException('User not found');
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: null },
      });
      response.success = true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return response;
  }

  async activateAccount(token: string): Promise<GenericResponse> {
    const response = new GenericResponse();
    try {
      const user = await this.prisma.user.findFirst({
        where: { activateAccountToken: token },
      });
      if (!user) throw new BadRequestException('User not found');
      await this.prisma.user.update({
        where: { id: user.id },
        data: { enabled: true, activateAccountToken: null },
      });
      response.success = true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return response;
  }

  async forgotPassword(request: ForgotPasswordModel): Promise<GenericResponse> {
    const response = new GenericResponse();
    try {
      let user = await this.prisma.user.findFirst({
        where: { email: request.email },
      });
      if (!user) throw new BadRequestException('User not found');

      const token = await MainHelpers.generateUUID();
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken: token },
      });

      // await this.mailService.sendForgotPasswordMail(user).catch(() => {
      //   throw new BadRequestException('Error occured while sending mail');
      // });

      response.success = true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return response;
  }

  async resetPassword(request: ResetPasswordModel): Promise<GenericResponse> {
    const response = new GenericResponse();
    try {
      const user = await this.prisma.user.findFirst({
        where: { resetPasswordToken: request.resetPasswordToken },
      });
      if (!user) throw new BadRequestException('User not found');

      const hashPassword = await MainHelpers.hashPassword(request.password);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashPassword },
      });

      // await this.mailService.sendResetPasswordMail(user).catch(() => {
      //   throw new BadRequestException('Error occured while sending mail');
      // });

      response.success = true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    return response;
  }

  comparePassword(password: string, hash: string) {
    return compare(password, hash);
  }

  async generateToken(user: UserDto): Promise<TokenResponse> {
    if (!user) return null;
    let roles: string[] = [];
    if (user.roles) roles = user.roles.map((x) => x.code);

    const userPayload: JwtPayload = {
      id: user.id,
      roles,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      enabled: user.enabled,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(userPayload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: '1800s',
      }),
      this.jwtService.signAsync(userPayload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      accesToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { GenericResponse } from '../../core/types/responses';
import { UserDto } from '../users/user.dto';

export class AuthRequest {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => UserDto)
  @ApiProperty({ type: () => UserDto })
  user: UserDto;
}

export class LoginRequest {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class ForgotPasswordModel {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}

export class ResetPasswordModel {
  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  resetPasswordToken: string;
}

export class AuthResponse extends GenericResponse {
  @ApiProperty()
  accessToken: string;

  @ApiPropertyOptional()
  refreshToken?: string;
}

export class RegisterResponse extends AuthResponse {
  @ApiProperty({ type: () => UserDto })
  user: UserDto;
}

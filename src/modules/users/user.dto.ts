import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { CoreDto } from '../../core/tools/core.dto';
import { GenericResponse } from '../../core/types/responses';
import { UserRoleDto } from './users-roles/user-role.dto';

export class UserDto extends CoreDto {
  @IsNotEmpty()
  @ApiProperty()
  firstname: string;

  @IsNotEmpty()
  @ApiProperty()
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty()
  password?: string;

  @ApiPropertyOptional({ isArray: true, type: () => UserRoleDto })
  roles?: UserRoleDto[];

  @ApiPropertyOptional()
  refreshToken?: string;

  @ApiPropertyOptional()
  birthdate?: Date;

  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  activateAccountToken?: string;

  @ApiPropertyOptional()
  resetPasswordToken?: string;
}

export class GetUsers extends GenericResponse {
  @ApiProperty({ isArray: true, type: UserDto })
  data: UserDto[];
}

export class GetUser extends GenericResponse {
  @ApiProperty({ isArray: false, type: UserDto })
  data: UserDto;
}
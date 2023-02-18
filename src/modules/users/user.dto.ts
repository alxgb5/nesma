import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UserDto {
    @ApiPropertyOptional()
    id?: number;

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
    password: string;

    @ApiPropertyOptional()
    createdAt?: Date;

    @ApiPropertyOptional()
    updatedAt?: Date;

    @ApiPropertyOptional({ required: false, default: true })
    enabled?: boolean;

    @ApiPropertyOptional()
    roles: string[];
}
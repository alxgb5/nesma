import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { GenericResponse } from '../../core/types/responses';

export class AuthRequest {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @IsString()
    @ApiPropertyOptional()
    firstname?: string;

    @IsString()
    @ApiPropertyOptional()
    lastname?: string;
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

export class AuthResponse extends GenericResponse {
    @ApiProperty()
    accessToken: string;

    @ApiPropertyOptional()
    refreshToken?: string;
}
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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

export class AuthResponse {
    @ApiProperty()
    accessToken: string;

    @ApiPropertyOptional()
    refreshToken?: string;
}
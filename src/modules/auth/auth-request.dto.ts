import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthRequest {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    password: string;
}

export class AuthResponse {
    @ApiProperty()
    accessToken: string;

    @ApiPropertyOptional()
    refreshToken?: string;
}
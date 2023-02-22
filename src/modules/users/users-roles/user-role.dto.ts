import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserDto } from '../user.dto';

export class UserRoleDto {
    @ApiPropertyOptional()
    id?: number;

    @ApiProperty()
    @IsNotEmpty()
    code: string;

    @ApiPropertyOptional({ isArray: true, type: UserDto })
    users: UserDto[];
}

export class RoleDto {
    @ApiProperty()
    role: string;
    @ApiProperty()
    id: number;
}
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CoreDto {
    @ApiPropertyOptional()
    id?: number;

    @ApiPropertyOptional()
    createdAt?: Date;

    @ApiPropertyOptional()
    updatedAt?: Date;

    @ApiPropertyOptional({ required: false, default: true })
    enabled?: boolean;
}
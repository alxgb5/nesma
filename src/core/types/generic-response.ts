import { ApiProperty } from '@nestjs/swagger';

export class GenericResponse {
    @ApiProperty({ description: 'State of the response', type: Boolean })
    success: boolean;
}
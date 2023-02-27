import { ApiProperty } from '@nestjs/swagger';

export class GenericResponse {
    @ApiProperty({ description: 'State of the response', type: Boolean })
    success: boolean = false;
}

export class BaseSearchResponse {
    @ApiProperty({ description: 'Total number of items', type: Number })
    filteredResult: number;
}
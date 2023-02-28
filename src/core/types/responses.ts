import { ApiProperty } from '@nestjs/swagger';

export class GenericResponse {
    @ApiProperty({ description: 'State of the response', type: Boolean })
    success: boolean = false;
}

export class BaseSearchResponse {
    @ApiProperty({ description: 'Total number of items', type: Number })
    filteredResult: number;
}

export class ErrorResponse {
    @ApiProperty({ description: 'State of the response', type: Boolean, default: false })
    success: boolean = false;

    @ApiProperty({ description: 'Error message', type: String })
    message: string;

    @ApiProperty({ description: 'Error code', type: Number })
    statusCode: number;

    @ApiProperty({ description: 'Error stack', type: String })
    error: string;
}
import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../types/responses';

interface ApiDocsParamms {
  summary: string;
  operationId: string;
  badRequestMessage: any;
}

export function ApiDocs(params: ApiDocsParamms) {
  return applyDecorators(
    ApiOperation({ summary: params.summary, operationId: params.operationId }),
    ApiBadRequestResponse({ description: params.badRequestMessage, type: ErrorResponse }),
  );
}

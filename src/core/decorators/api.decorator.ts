import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

interface ApiDocsParamms {
  summary: string;
  operationId: string;
  resStatus: HttpStatus;
  resType: any;
}

export function ApiDocs(params: ApiDocsParamms) {
  return applyDecorators(
    ApiOperation({ summary: params.summary, operationId: params.operationId }),
    ApiResponse({
      status: params.resStatus ?? HttpStatus.OK,
      description: params.summary,
      type: params.resType,
    }),
    HttpCode(params.resStatus ?? HttpStatus.OK),
  );
}

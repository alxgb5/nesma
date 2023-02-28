import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoggedGuard } from '../guards/logged.guard';
import { ErrorResponse } from '../types/responses';

export function UserLogged() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorResponse }),
    UseGuards(LoggedGuard)
  );
}
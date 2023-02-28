import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LoggedGuard } from '../guards/logged.guard';

export function UserLogged() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' }),
    UseGuards(LoggedGuard)
  );
}

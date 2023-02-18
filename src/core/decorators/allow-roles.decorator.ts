import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RolesGuard } from '../guards/roles.guard';

export function AllowRoles(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    ApiBearerAuth(),
    UseGuards(RolesGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' }),
  );
}

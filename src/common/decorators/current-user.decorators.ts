// src/common/decorators/current-user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * ======================
 * CurrentUser Decorator
 * ======================
 *
 * Usage:
 * - @CurrentUser() user
 * - @CurrentUser('id') userId
 * - @CurrentUser('role') role
 *
 * Requires:
 * - JwtAuthGuard
 * - JwtStrategy (attach user to request)
 */
export const CurrentUser = createParamDecorator(
  (property: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      return null;
    }

    return property ? user[property] : user;
  },
);

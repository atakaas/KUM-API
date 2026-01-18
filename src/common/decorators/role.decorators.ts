// src/common/decorators/roles.decorator.ts

import { SetMetadata } from '@nestjs/common';

type UserRole = 'ADMIN' | 'STAFF' | string;

export const ROLES_KEY = 'roles';

/**
 * Roles Decorator
 *
 * Usage:
 * @Roles(UserRole.ADMIN)
 * @Roles(UserRole.ADMIN, UserRole.STAFF)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

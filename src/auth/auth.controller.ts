// src/auth/auth.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * ======================
   * Register (ADMIN / STAFF)
   * ======================
   * Note:
   * - OWNER tidak register via backend (localStorage only)
   */
  @Post('register')
  @ApiOperation({
    summary: 'Register new user (Admin / Staff)',
    description:
      'Create a new system user for KUM Villa Management (Admin or Staff)',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already registered',
  })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * ======================
   * Login
   * ======================
   * Used by:
   * - Admin dashboard
   * - Staff dashboard
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate Admin or Staff and return access & refresh tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  async login(req: { user: { id: string; email: string; firstName: string; lastName: string; role: any; }; }, @Body()
dto: LoginDto) {
    return this.authService.login(dto);
  }
}

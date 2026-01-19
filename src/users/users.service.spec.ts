/**
 * IMPORTANT:
 * bcrypt MUST be mocked at module level
 */
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../database/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../auth/dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ======================
  // CREATE
  // ======================
  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.STAFF,
      };

      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const expectedUser = {
        id: '1',
        email: createUserDto.email,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        role: UserRole.STAFF,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
      expect(result).toEqual(expectedUser);
    });
  });

  // ======================
  // UPDATE
  // ======================
  describe('update', () => {
    it('should hash password if provided', async () => {
      const updateUserDto = {
        firstName: 'Updated',
        password: 'newPassword',
      };

      const hashedPassword = 'newHashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const updatedUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Updated',
        lastName: 'Doe',
        role: UserRole.STAFF,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('should update user without hashing password if not provided', async () => {
      const updateUserDto = {
        firstName: 'Updated',
      };

      const updatedUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'Updated',
        lastName: 'Doe',
        role: UserRole.STAFF,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });
  });
});

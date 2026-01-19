import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../auth/dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login and return tokens', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const mockUser = {
        id: '1',
        email: dto.email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'STAFF',
      };

      const result = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        user: mockUser,
      };

      mockAuthService.login.mockResolvedValue(result);

      // 👇 MOCK REQUEST OBJECT
      const req = { user: mockUser };

      const response = await controller.login(req, dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('register', () => {
    it('should call authService.register and return user', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockAuthService.register.mockResolvedValue({
        id: '1',
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'STAFF',
      });

      const response = await controller.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(response.email).toBe(dto.email);
    });
  });
});

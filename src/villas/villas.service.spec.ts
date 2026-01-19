import { Test, TestingModule } from '@nestjs/testing';
import { VillasService } from './villas.service';
import { PrismaService } from '../database/prisma.service';

describe('VillasService', () => {
  let service: VillasService;

  const mockPrismaService = {
    villa: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VillasService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<VillasService>(VillasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

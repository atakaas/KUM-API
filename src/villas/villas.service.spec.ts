import { Test, TestingModule } from '@nestjs/testing';
import { VillasService } from './villas.service';

describe('VillasService', () => {
  let service: VillasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VillasService],
    }).compile();

    service = module.get<VillasService>(VillasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

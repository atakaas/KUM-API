import { Test, TestingModule } from '@nestjs/testing';
import { VillasController } from './villas.controller';
import { VillasService } from './villas.service';

describe('VillasController', () => {
  let controller: VillasController;

  const mockVillasService = {
    // add mocked methods later when testing endpoints
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VillasController],
      providers: [
        {
          provide: VillasService,
          useValue: mockVillasService,
        },
      ],
    }).compile();

    controller = module.get<VillasController>(VillasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

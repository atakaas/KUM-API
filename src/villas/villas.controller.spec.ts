import { Test, TestingModule } from '@nestjs/testing';
import { VillasController } from './villas.controller';

describe('VillasController', () => {
  let controller: VillasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VillasController],
    }).compile();

    controller = module.get<VillasController>(VillasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

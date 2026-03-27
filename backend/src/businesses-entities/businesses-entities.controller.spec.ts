import { Test, TestingModule } from '@nestjs/testing';
import { BusinessesEntitiesController } from './businesses-entities.controller';
import { BusinessesEntitiesService } from './businesses-entities.service';

describe('BusinessesEntitiesController', () => {
  let controller: BusinessesEntitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessesEntitiesController],
      providers: [BusinessesEntitiesService],
    }).compile();

    controller = module.get<BusinessesEntitiesController>(BusinessesEntitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

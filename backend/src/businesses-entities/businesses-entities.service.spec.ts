import { Test, TestingModule } from '@nestjs/testing';
import { BusinessesEntitiesService } from './businesses-entities.service';

describe('BusinessesEntitiesService', () => {
  let service: BusinessesEntitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessesEntitiesService],
    }).compile();

    service = module.get<BusinessesEntitiesService>(BusinessesEntitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

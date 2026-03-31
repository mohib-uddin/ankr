import { Test, TestingModule } from '@nestjs/testing';
import { PackageTemplatesController } from './package-templates.controller';
import { PackageTemplatesService } from './package-templates.service';

describe('PackageTemplatesController', () => {
  let controller: PackageTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackageTemplatesController],
      providers: [PackageTemplatesService],
    }).compile();

    controller = module.get<PackageTemplatesController>(PackageTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PackageTemplatesController } from './package-templates.controller';
import { PackageTemplatesService } from './package-templates.service';

describe('PackageTemplatesController', () => {
  let controller: PackageTemplatesController;
  let service: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackageTemplatesController],
      providers: [
        {
          provide: PackageTemplatesService,
          useValue: {
            getAllTemplates: jest.fn(),
            getTemplateById: jest.fn(),
            createTemplate: jest.fn(),
            updateTemplate: jest.fn(),
            deleteTemplate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PackageTemplatesController>(PackageTemplatesController);
    service = module.get<PackageTemplatesService>(PackageTemplatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllTemplates', () => {
      it('should call service.getAllTemplates', async () => {
          const pagination = { page: 1, limit: 10 };
          service.getAllTemplates.mockResolvedValue({ data: [], total: 0 });
          
          await controller.getAllTemplates(pagination);
          expect(service.getAllTemplates).toHaveBeenCalledWith(pagination);
      });
  });

  describe('getTemplateById', () => {
      it('should call service.getTemplateById', async () => {
          service.getTemplateById.mockResolvedValue({ data: {} });
          await controller.getTemplateById('t1');
          expect(service.getTemplateById).toHaveBeenCalledWith('t1');
      });
  });
});

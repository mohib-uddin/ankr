import { Test, TestingModule } from '@nestjs/testing';
import { PackageTemplatesService } from './package-templates.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PackageTemplate } from './entities/package-template.entity';
import { NotFoundException } from '@nestjs/common';

describe('PackageTemplatesService', () => {
  let service: PackageTemplatesService;
  let repo: any;

  const mockTemplate = { 
    id: 't1', 
    name: 'Loan', 
    items: [] 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackageTemplatesService,
        {
          provide: getRepositoryToken(PackageTemplate),
          useValue: {
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PackageTemplatesService>(PackageTemplatesService);
    repo = module.get(getRepositoryToken(PackageTemplate));
  });

  describe('getAllTemplates', () => {
    it('should return paginated results', async () => {
      repo.findAndCount.mockResolvedValue([[mockTemplate], 1]);
      const res = await service.getAllTemplates({ page: 1, limit: 10 });
      expect(res.data).toHaveLength(1);
      expect(res.total).toBe(1);
      expect(res.page).toBe(1);
    });
  });

  describe('getTemplateById', () => {
    it('should return template if exists', async () => {
      repo.findOne.mockResolvedValue(mockTemplate);
      const res = await service.getTemplateById('t1');
      expect(res.data.id).toBe('t1');
    });

    it('should throw NotFoundException if not exists', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.getTemplateById('t1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTemplate', () => {
    it('should generate UUIDs for items', async () => {
      repo.create.mockImplementation(dto => dto);
      repo.save.mockImplementation(t => t);

      const res = await service.createTemplate({
        name: 'New',
        items: [{ name: 'ID', category: 'ID', minCount: 1, maxCount: 1, description: 'Test' }]
      });

      expect(res.data.items[0].id).toBeDefined();
    });
  });
});

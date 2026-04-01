import { Test, TestingModule } from '@nestjs/testing';
import { UserPackagesService } from './user-packages.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserPackage } from './entities/user-package.entity';
import { Profile, PackageTemplate, Document } from '@entities';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserPackageStatus } from './types';
import { DocumentCategoryEnum } from '../documents/types/category.enum';

describe('UserPackagesService', () => {
  let service: UserPackagesService;
  let packageRepo: any;
  let profileRepo: any;
  let templateRepo: any;
  let documentRepo: any;

  const mockProfile = { id: 'p1', userId: 'u1' };
  const mockTemplate = {
    id: 't1',
    name: 'Loan',
    items: [
      { id: 'item1', name: 'ID', category: DocumentCategoryEnum.IDENTITY, minCount: 1, maxCount: 1 }
    ]
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserPackagesService,
        { provide: getRepositoryToken(UserPackage), useValue: { findOne: jest.fn(), create: jest.fn(), save: jest.fn(), delete: jest.fn(), find: jest.fn() } },
        { provide: getRepositoryToken(Profile), useValue: { findOne: jest.fn() } },
        { provide: getRepositoryToken(PackageTemplate), useValue: { findOne: jest.fn(), findAndCount: jest.fn() } },
        { provide: getRepositoryToken(Document), useValue: { find: jest.fn() } },
      ],
    }).compile();

    service = module.get<UserPackagesService>(UserPackagesService);
    packageRepo = module.get(getRepositoryToken(UserPackage));
    profileRepo = module.get(getRepositoryToken(Profile));
    templateRepo = module.get(getRepositoryToken(PackageTemplate));
    documentRepo = module.get(getRepositoryToken(Document));
  });

  describe('createOrUpdatePackage', () => {
    it('should throw NotFoundException if profile missing', async () => {
      profileRepo.findOne.mockResolvedValue(null);
      await expect(service.createOrUpdatePackage('u1', {} as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if template missing', async () => {
      profileRepo.findOne.mockResolvedValue(mockProfile);
      templateRepo.findOne.mockResolvedValue(null);
      await expect(service.createOrUpdatePackage('u1', { templateId: 't1' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should save as DRAFT if requirements not met', async () => {
      profileRepo.findOne.mockResolvedValue(mockProfile);
      templateRepo.findOne.mockResolvedValue(mockTemplate);
      documentRepo.find.mockResolvedValue([]); // No docs sent
      packageRepo.findOne.mockResolvedValue(null); // No existing package
      packageRepo.create.mockImplementation(dto => dto);
      packageRepo.save.mockImplementation(p => p);

      const res = await service.createOrUpdatePackage('u1', { name: 'Test', templateId: 't1', documents: [] });
      
      expect(res.data.status).toBe(UserPackageStatus.DRAFT);
    });

    it('should finalize and generate link if requirements met', async () => {
      profileRepo.findOne.mockResolvedValue(mockProfile);
      templateRepo.findOne.mockResolvedValue(mockTemplate);
      
      const mockDoc = { id: 'doc1', category: DocumentCategoryEnum.IDENTITY, profileId: 'p1' };
      documentRepo.find.mockResolvedValue([mockDoc]);
      
      packageRepo.findOne.mockResolvedValue(null);
      packageRepo.create.mockImplementation(dto => ({ ...dto }));
      packageRepo.save.mockImplementation(p => ({ ...p, id: 'pkg1' }));

      const res = await service.createOrUpdatePackage('u1', { 
        name: 'Test', 
        templateId: 't1', 
        documents: [{ templateItemId: 'item1', documentId: 'doc1' }] 
      });

      expect(res.data.status).toBe(UserPackageStatus.FINALIZED);
      expect(res.data.sharedLink).toBeDefined();
      expect(res.data.securityCode).toHaveLength(8);
    });

    it('should throw BadRequestException if document category mismatches', async () => {
        profileRepo.findOne.mockResolvedValue(mockProfile);
        templateRepo.findOne.mockResolvedValue(mockTemplate);
        
        const mockDoc = { id: 'doc1', category: DocumentCategoryEnum.TAX, profileId: 'p1' }; // WRONG CATEGORY
        documentRepo.find.mockResolvedValue([mockDoc]);

        await expect(service.createOrUpdatePackage('u1', { 
            name: 'Test', 
            templateId: 't1', 
            documents: [{ templateItemId: 'item1', documentId: 'doc1' }] 
        })).rejects.toThrow(BadRequestException);
    });
  });

  describe('getPackageByLink', () => {
    it('should throw BadRequestException if expired', async () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        
        packageRepo.findOne.mockResolvedValue({ 
            sharedLink: 'link1', 
            expiresAt: pastDate 
        });

        await expect(service.getPackageByLink('link1')).rejects.toThrow(BadRequestException);
    });
  });
});

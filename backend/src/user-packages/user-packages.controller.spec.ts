import { Test, TestingModule } from '@nestjs/testing';
import { UserPackagesController } from './user-packages.controller';
import { UserPackagesService } from './user-packages.service';

describe('UserPackagesController', () => {
  let controller: UserPackagesController;
  let service: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPackagesController],
      providers: [
        {
          provide: UserPackagesService,
          useValue: {
            createOrUpdatePackage: jest.fn(),
            deletePackage: jest.fn(),
            getUserPackages: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserPackagesController>(UserPackagesController);
    service = module.get<UserPackagesService>(UserPackagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUserPackage', () => {
      it('should call service.createOrUpdatePackage', async () => {
          const dto = { name: 'Test' } as any;
          const req = { user: { id: 'u1' } } as any;
          service.createOrUpdatePackage.mockResolvedValue({ data: {} });
          
          await controller.createUserPackage(req, dto);
          expect(service.createOrUpdatePackage).toHaveBeenCalledWith('u1', dto);
      });
  });
  
  describe('deletePackage', () => {
      it('should call service.deletePackage', async () => {
          const req = { user: { id: 'u1' } } as any;
          service.deletePackage.mockResolvedValue({ data: null });
          
          await controller.deletePackage('p1', req);
          expect(service.deletePackage).toHaveBeenCalledWith('p1', 'u1');
      });
  });
});

import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiMessage, ApiMessageData, ApiMessageDataPagination, StorageProviderInterface } from '@types';
import { Repository } from 'typeorm';
import { Document, Folder, Profile } from '@entities';
import { SuccessResponseMessages } from '@messages';
import { CreateDocumentWithoutProfileDto, UpdateDocumentDto, CreateFolderWithoutProfileDto, UpdateFolderDto, PaginationDto, GetDocumentsQueryDto } from '@dtos';


@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @Inject('StorageProvider')
    private readonly storageProvider: StorageProviderInterface,
  ) {}

  async createDocument(userId: string, createDocumentDto: CreateDocumentWithoutProfileDto, file: Express.Multer.File): Promise<ApiMessageData<Document>> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found. Please complete onboarding first.');

    if (file) {
      createDocumentDto.filePath = await this.storageProvider.uploadFile(file);
    }
    const document = this.documentRepository.create({
      ...createDocumentDto,
      profileId: profile.id
    });
    const savedDocument = await this.documentRepository.save(document);
    return { message: SuccessResponseMessages.successGeneral, data: savedDocument };
  }

  async getDocuments(userId?: string, getDocumentsQuery: GetDocumentsQueryDto = {}): Promise<ApiMessageDataPagination<Document>> {
    const { page = 1, limit = 10, folderId, propertyId, category } = getDocumentsQuery;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      query.profileId = profile.id;
    }

    if (folderId) query.folderId = folderId;
    if (propertyId) query.linkedPropertyId = propertyId;
    if (category) query.category = category;

    const [documents, total] = await this.documentRepository.findAndCount({
      where: query,
      relations: ['folder', 'property'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    const lastPage = Math.ceil(total / limit);

    return { 
      message: SuccessResponseMessages.successGeneral, 
      data: documents,
      page,
      lastPage,
      total
    };
  }

  async getDocumentById(id: string, userId?: string): Promise<ApiMessageData<Document>> {
    const query: any = { id };
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      query.profileId = profile.id;
    }

    const document = await this.documentRepository.findOne({
      where: query,
      relations: ['folder', 'property'],
    });
    if (!document) throw new NotFoundException('Document not found');
    return { message: SuccessResponseMessages.successGeneral, data: document };
  }

  async updateDocument(id: string, updateDocumentDto: UpdateDocumentDto, file: Express.Multer.File): Promise<ApiMessageData<Document>> {
    const existingDocument = await this.documentRepository.findOne({ where: { id } });
    if (!existingDocument) throw new NotFoundException('Document not found');

    if (file) {
      if (existingDocument.filePath) {
        await this.storageProvider.deleteFile(existingDocument.filePath);
      }
      updateDocumentDto.filePath = await this.storageProvider.uploadFile(file);
    }

    await this.documentRepository.update(id, updateDocumentDto);
    const document = await this.documentRepository.findOne({ where: { id } });
    return { message: SuccessResponseMessages.successGeneral, data: document };
  }

  async deleteDocument(id: string): Promise<ApiMessage> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (document && document.filePath) {
      await this.storageProvider.deleteFile(document.filePath);
    }
    await this.documentRepository.delete(id);
    return { message: SuccessResponseMessages.successGeneral };
  }

  // --- Folder Methods ---

  async createFolder(userId: string, createFolderDto: CreateFolderWithoutProfileDto): Promise<ApiMessageData<Folder>> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found. Please complete onboarding first.');

    const folder = this.folderRepository.create({
      ...createFolderDto,
      profileId: profile.id
    });
    const savedFolder = await this.folderRepository.save(folder);
    return { message: SuccessResponseMessages.successGeneral, data: savedFolder };
  }

  async getFolders(userId?: string, paginationDto: PaginationDto = {}): Promise<ApiMessageDataPagination<Folder>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      query.profileId = profile.id;
    }

    const [folders, total] = await this.folderRepository.findAndCount({
      where: query,
      relations: ['children'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    const lastPage = Math.ceil(total / limit);
    const rootFolders = folders.filter((f) => !f.parentFolderId);

    return { 
      message: SuccessResponseMessages.successGeneral, 
      data: rootFolders,
      page,
      lastPage,
      total
    };
  }

  async getFolderById(id: string, userId?: string): Promise<ApiMessageData<Folder>> {
    const query: any = { id };
    if (userId) {
      const profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) throw new NotFoundException('Profile not found');
      query.profileId = profile.id;
    }

    const folder = await this.folderRepository.findOne({
      where: query,
      relations: ['children', 'documents'],
    });
    if (!folder) throw new NotFoundException('Folder not found');
    return { message: SuccessResponseMessages.successGeneral, data: folder };
  }

  async updateFolder(id: string, updateFolderDto: UpdateFolderDto): Promise<ApiMessageData<Folder>> {

    await this.folderRepository.update(id, updateFolderDto);
    const folder = await this.folderRepository.findOne({ where: { id } });
    return { message: SuccessResponseMessages.successGeneral, data: folder };
  }

  async deleteFolder(id: string): Promise<ApiMessage> {
    const folder = await this.folderRepository.findOne({
      where: { id },
      relations: ['children', 'documents'],
    });

    if (!folder) throw new NotFoundException('Folder not found');

    // Recursive deletion of children folders
    for (const child of folder.children) {
      await this.deleteFolder(child.id);
    }

    // Deletion of documents in this folder
    for (const doc of folder.documents) {
      await this.deleteDocument(doc.id);
    }

    // Finally delete the folder itself
    await this.folderRepository.delete(id);
    return { message: SuccessResponseMessages.successGeneral };
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Req, Query, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentWithoutProfileDto, UpdateDocumentDto, CreateFolderWithoutProfileDto, UpdateFolderDto, PaginationQueryDto, GetDocumentsQueryDto } from '@dtos';
import { ApiTags, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { SwaggerApiResponse, AttachmentUpload } from '@decorators';
import { Document, Folder } from '@entities';
import { Request } from 'express';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @AttachmentUpload('file')
  @ApiConsumes('multipart/form-data')
  @SwaggerApiResponse({ description: 'Upload / Create a new document', type: Document })
  createDocument(@Body() createDocumentDto: CreateDocumentWithoutProfileDto, @UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.documentsService.createDocument(req.user.id, createDocumentDto, file);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve all documents for the current user', type: Document, isArray: true })
  getDocuments(@Req() req: Request, @Query() getDocumentsQuery: GetDocumentsQueryDto) {
    return this.documentsService.getDocuments(req.user.id, getDocumentsQuery);
  }

  @Get('counts')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Get category and folder-wise document counts' })
  getDocumentCounts(@Req() req: Request) {
    return this.documentsService.getDocumentCounts(req.user.id);
  }

  // --- Folder Endpoints ---

  @Post('folders')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Create a new folder', type: Folder })
  createFolder(@Body() createFolderDto: CreateFolderWithoutProfileDto, @Req() req: Request) {
    return this.documentsService.createFolder(req.user.id, createFolderDto);
  }

  @Get('folders')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve folder hierarchy for the current user', type: Folder, isArray: true })
  getFolders(@Req() req: Request, @Query() paginationQuery: PaginationQueryDto) {
    return this.documentsService.getFolders(req.user.id, paginationQuery);
  }

  @Get('folders/:id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve a folder with its children and documents', type: Folder })
  getFolderById(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.documentsService.getFolderById(id, req.user.id);
  }


  @Patch('folders/:id')

  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Update a folder', type: Folder })
  updateFolder(@Param('id', ParseUUIDPipe) id: string, @Body() updateFolderDto: UpdateFolderDto) {
    return this.documentsService.updateFolder(id, updateFolderDto);
  }

  @Delete('folders/:id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Remove a folder' })
  deleteFolder(@Param('id', ParseUUIDPipe) id: string) {
    return this.documentsService.deleteFolder(id);
  }

  // --- Document Detail Endpoints ---

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Retrieve a single document', type: Document })
  getDocumentById(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.documentsService.getDocumentById(id, req.user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @AttachmentUpload('file')
  @ApiConsumes('multipart/form-data')
  @SwaggerApiResponse({ description: 'Update a document', type: Document })
  updateDocument(@Param('id', ParseUUIDPipe) id: string, @Body() updateDocumentDto: UpdateDocumentDto, @UploadedFile() file: Express.Multer.File) {
    return this.documentsService.updateDocument(id, updateDocumentDto, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @SwaggerApiResponse({ description: 'Remove a document' })
  deleteDocument(@Param('id', ParseUUIDPipe) id: string) {
    return this.documentsService.deleteDocument(id);
  }
}


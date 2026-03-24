/* eslint-disable @typescript-eslint/no-unused-vars */
import { fileMimetypeFilter } from '@filters';
import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export function FileUpload(fieldName: string = 'file', required: boolean = false, localOptions?: MulterOptions) {
  return applyDecorators(UseInterceptors(FileInterceptor(fieldName, localOptions)));
}

export function MultipleFilesUpload(fieldName: string = 'files', maxCount: number, required: boolean = false, localOptions?: MulterOptions) {
  return applyDecorators(UseInterceptors(FilesInterceptor(fieldName, maxCount, localOptions)));
}

export function AttachmentUpload(fileName: string = 'image', required: boolean = false) {
  return FileUpload(fileName, required, {
    fileFilter: fileMimetypeFilter('png', 'jpg', 'jpeg', 'pdf', 'xlsx', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'csv', 'mpeg', 'mp3', 'MP3', 'mpeg', 'aac'),
  });
}

export function AttachmentsUpload(fieldName: string = 'attachments', maxCount: number, required: boolean = false) {
  return MultipleFilesUpload(fieldName, maxCount, required, {
    fileFilter: fileMimetypeFilter('png', 'jpg', 'jpeg', 'pdf', 'xlsx', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'csv', 'mpeg', 'mp3', 'MP3', 'mpeg', 'aac'),
  });
}

export function ImageUpload(fileName: string = 'image', required: boolean = false) {
  return FileUpload(fileName, required, {
    fileFilter: fileMimetypeFilter('png', 'jpg', 'jpeg'),
  });
}

export function ImagesUpload(fieldName: string = 'images', maxCount: number, required: boolean = false) {
  return MultipleFilesUpload(fieldName, maxCount, required, {
    fileFilter: fileMimetypeFilter('png', 'jpg', 'jpeg'),
  });
}

export function xlUpload(fileName: string = 'file', required: boolean = false) {
  return FileUpload(fileName, required, {
    fileFilter: fileMimetypeFilter('xls', 'xlsx', 'CSV', 'csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
  });
}

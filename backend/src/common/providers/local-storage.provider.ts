import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { nanoid } from 'nanoid';
import { StorageProviderInterface } from './storage-provider.interface';
import * as process from 'process';

@Injectable()
export class LocalStorageProvider implements StorageProviderInterface {
  private readonly path: string = process.env.STORAGE_PATH;

  constructor() {}

  uploadFile(file: Express.Multer.File): string {
    const mimeType = file.mimetype;
    const fileExtension = mimeType.split('/')[1];
    let extension = fileExtension;
    if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      extension = 'xlsx';
    }
    const fileName = `${nanoid()}.${extension}`;
    fs.writeFileSync(this.path + '/' + fileName, file.buffer, 'utf8');
    return fileName;
  }

  uploadFiles(files: Express.Multer.File[]): string[] {
    const uploadedFiles: string[] = [];

    files.forEach((file) => {
      const mimeType = file.mimetype;
      const fileExtension = mimeType.split('/')[1];
      let extension = fileExtension;
      if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        extension = 'xlsx';
      }
      const fileName = `${nanoid()}.${extension}`;
      fs.writeFileSync(`${this.path}/${fileName}`, file.buffer, 'binary');
      uploadedFiles.push(fileName);
    });

    return uploadedFiles;
  }

  deleteFile(fileName: string): void {
    const path = this.path + '/' + fileName;
    fs.existsSync(path) && fs.unlinkSync(path);
  }

  deleteFiles(fileNames: string[]): void {
    console.log({ fileNames });
    fileNames.forEach((name) => {
      const path = this.path + '/' + name;
      console.log({ path });
      fs.existsSync(path) && fs.unlinkSync(path);
    });
  }
}

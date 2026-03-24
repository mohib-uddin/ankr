import { UnsupportedMediaTypeException } from '@nestjs/common';
import { ErrorResponseMessages } from '@messages';

export function fileMimetypeFilter(...mimetypes: string[]) {
  return (req, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (mimetypes.some((m) => file.mimetype.includes(m))) {
      console.log(file.mimetype);
      callback(null, true);
    } else {
      console.log(file.mimetype);
      callback(new UnsupportedMediaTypeException(`${ErrorResponseMessages.fileType}: ${mimetypes.join(', ')}`), false);
    }
  };
}

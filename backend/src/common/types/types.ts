export const dateFormat = 'YYYY-MM-DD';
export const timeFormat = 'HH:mm:ss';
export const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

import { ApiProperty } from '@nestjs/swagger';

export class ApiMessage {
  @ApiProperty()
  message: string;
}

export class ApiMessageData<T = any> extends ApiMessage {
  @ApiProperty()
  data: T;
}

export class ApiMessageDataPagination<T = any> extends ApiMessageData<T[]> {
  @ApiProperty()
  page: number;
  @ApiProperty()
  lastPage: number;
  @ApiProperty()
  total: number;
}


export enum SortEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum ProviderEnum {
  GITHUB = 'github',
  GOOGLE = 'google',
  LOCAL= 'local'
}


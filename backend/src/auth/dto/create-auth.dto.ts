import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  name: string;
}
import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDate()
  @IsNotEmpty()
  dueDate: Date;

  @IsOptional()
  completed?: boolean = false;

  @IsOptional()
  @IsString()
  userId: string;

  @IsString()
  @IsNotEmpty()
  villaId: string;
}
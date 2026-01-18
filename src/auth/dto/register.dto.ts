import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  dateOfBirth?: Date;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
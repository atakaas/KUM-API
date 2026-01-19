import { PartialType } from '@nestjs/swagger';
import { CreateVillaDto } from './create-villa.dto';
import { VillaStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateVillaDto extends PartialType(CreateVillaDto) {
  @IsOptional()
  @IsEnum(VillaStatus)
  status?: VillaStatus;
}

import { Module } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PrismaModule } from 'src/database/prisma.module';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
 
}
@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService], // ⬅️ WAJIB
})
export class UsersModule {}

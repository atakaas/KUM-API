import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Villa, VillaStatus } from '@prisma/client';
import { CreateVillaDto } from '../auth/dto/create-villa.dto';
import { UpdateVillaDto } from '../auth/dto/update-villa.dto';

@Injectable()
export class VillasService {
  constructor(private prisma: PrismaService) {}

  async create(createVillaDto: CreateVillaDto): Promise<Villa> {
  return this.prisma.villa.create({
    data: {
      ...createVillaDto,
      status: VillaStatus.AVAILABLE,
    },
  });
}

  async findAll(): Promise<Villa[]> {
    return this.prisma.villa.findMany({
      include: {
        rooms: true,
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Villa | null> {
    return this.prisma.villa.findUnique({
      where: { id },
      include: {
        rooms: true,
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, updateVillaDto: UpdateVillaDto): Promise<Villa> {
    return this.prisma.villa.update({
      where: { id },
      data: updateVillaDto,
      include: {
        rooms: true,
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<Villa> {
    return this.prisma.villa.delete({
      where: { id },
    });
  }

  async findAvailableVillas(
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<Villa[]> {
    // Find villas that are not booked during the specified dates
    const bookedVillas = await this.prisma.villa.findMany({
      where: {
        bookings: {
          some: {
            OR: [
              {
                AND: [
                  { checkInDate: { lte: checkInDate } },
                  { checkOutDate: { gt: checkInDate } },
                ],
              },
              {
                AND: [
                  { checkInDate: { lt: checkOutDate } },
                  { checkOutDate: { gte: checkOutDate } },
                ],
              },
              {
                AND: [
                  { checkInDate: { gte: checkInDate } },
                  { checkOutDate: { lte: checkOutDate } },
                ],
              },
            ],
          },
        },
      },
      select: { id: true },
    });

    const bookedVillaIds = bookedVillas.map((villa) => villa.id);

    return this.prisma.villa.findMany({
      where: {
        id: {
          notIn: bookedVillaIds,
        },
      },
      include: {
        rooms: true,
      },
    });
  }

  async findVillasByStaffId(staffId: string): Promise<Villa[]> {
    return this.prisma.villa.findMany({
      where: {
        staff: {
          some: {
            id: staffId,
          },
        },
      },
      include: {
        rooms: true,
      },
    });
  }
}

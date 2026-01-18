import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Room } from '@prisma/client';
import { CreateRoomDto } from '../auth/dto/create-room.dto';
import { UpdateRoomDto } from '../auth/dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    return this.prisma.room.create({
      data: createRoomDto,
    });
  }

  async findAll(): Promise<Room[]> {
    return this.prisma.room.findMany({
      include: {
        villa: true,
      },
    });
  }

  async findByVillaId(villaId: string): Promise<Room[]> {
    return this.prisma.room.findMany({
      where: { villaId },
      include: {
        villa: true,
      },
    });
  }

  async findOne(id: string): Promise<Room | null> {
    return this.prisma.room.findUnique({
      where: { id },
      include: {
        villa: true,
      },
    });
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    return this.prisma.room.update({
      where: { id },
      data: updateRoomDto,
      include: {
        villa: true,
      },
    });
  }

  async remove(id: string): Promise<Room> {
    return this.prisma.room.delete({
      where: { id },
    });
  }

  async findAvailableRooms(
    villaId: string,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<Room[]> {
    // Find rooms that are not booked during the specified dates
    const bookedRooms = await this.prisma.room.findMany({
      where: {
        villaId,
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

    const bookedRoomIds = bookedRooms.map(room => room.id);

    return this.prisma.room.findMany({
      where: {
        villaId,
        id: {
          notIn: bookedRoomIds,
        },
      },
    });
  }
}
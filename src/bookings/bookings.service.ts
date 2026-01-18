import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Booking, BookingStatus, PaymentStatus } from '@prisma/client';
import { CreateBookingDto } from '../auth/dto/create-booking.dto';
import { UpdateBookingDto } from '../auth/dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Check if the room is available for the specified dates
    const isAvailable = await this.checkRoomAvailability(
      createBookingDto.roomId,
      createBookingDto.checkInDate,
      createBookingDto.checkOutDate,
    );

    if (!isAvailable) {
      throw new Error('Room is not available for the selected dates');
    }

    return this.prisma.booking.create({
      data: createBookingDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        villa: true,
        room: true,
      },
    });
  }

  async findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        villa: true,
        room: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        villa: true,
        room: true,
      },
    });
  }

  async findByStaffId(staffId: string): Promise<Booking[]> {
    // Find villas assigned to the staff
    const staffVillas = await this.prisma.villa.findMany({
      where: {
        staff: {
          some: {
            id: staffId,
          },
        },
      },
      select: { id: true },
    });

    const villaIds = staffVillas.map(villa => villa.id);

    // Find bookings for those villas
    return this.prisma.booking.findMany({
      where: {
        villaId: {
          in: villaIds,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        villa: true,
        room: true,
      },
    });
  }

  async findOne(id: string): Promise<Booking | null> {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        villa: true,
        room: true,
      },
    });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    // If dates are being updated, check availability
    if (updateBookingDto.checkInDate || updateBookingDto.checkOutDate) {
      const booking = await this.prisma.booking.findUnique({
        where: { id },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      const checkInDate = updateBookingDto.checkInDate || booking.checkInDate;
      const checkOutDate = updateBookingDto.checkOutDate || booking.checkOutDate;

      const isAvailable = await this.checkRoomAvailability(
        booking.roomId,
        checkInDate,
        checkOutDate,
        id, // Exclude current booking from availability check
      );

      if (!isAvailable) {
        throw new Error('Room is not available for the selected dates');
      }
    }

    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        villa: true,
        room: true,
      },
    });
  }

  async remove(id: string): Promise<Booking> {
    return this.prisma.booking.delete({
      where: { id },
    });
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id },
      data: { bookingStatus: status },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        villa: true,
        room: true,
      },
    });
  }

  async updatePaymentStatus(id: string, status: PaymentStatus): Promise<Booking> {
    return this.prisma.booking.update({
      where: { id },
      data: { paymentStatus: status },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        villa: true,
        room: true,
      },
    });
  }

  private async checkRoomAvailability(
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        roomId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
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
    });

    return existingBookings.length === 0;
  }

  async getBookingsCalendar(villaId?: string, year?: number, month?: number): Promise<any> {
    const whereClause: any = {};
    
    if (villaId) {
      whereClause.villaId = villaId;
    }
    
    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      whereClause.OR = [
        {
          AND: [
            { checkInDate: { lte: startDate } },
            { checkOutDate: { gt: startDate } },
          ],
        },
        {
          AND: [
            { checkInDate: { lt: endDate } },
            { checkOutDate: { gte: endDate } },
          ],
        },
        {
          AND: [
            { checkInDate: { gte: startDate } },
            { checkOutDate: { lte: endDate } },
          ],
        },
      ];
    }

    const bookings = await this.prisma.booking.findMany({
      where: whereClause,
      include: {
        villa: true,
        room: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return bookings;
  }
}
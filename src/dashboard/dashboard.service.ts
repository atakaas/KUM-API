import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminDashboard() {
    // Get counts
    const villasCount = await this.prisma.villa.count();
    const roomsCount = await this.prisma.room.count();
    const bookingsCount = await this.prisma.booking.count();
    const usersCount = await this.prisma.user.count();
    const staffCount = await this.prisma.user.count({
      where: { role: 'STAFF' },
    });

    // Get recent bookings
    const recentBookings = await this.prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
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

    // Get upcoming check-ins (next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingCheckIns = await this.prisma.booking.findMany({
      where: {
        checkInDate: {
          gte: today,
          lte: nextWeek,
        },
        bookingStatus: 'CONFIRMED',
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
      orderBy: {
        checkInDate: 'asc',
      },
    });

    // Get monthly revenue for the current year
    const currentYear = new Date().getFullYear();
    const monthlyRevenue: { month: number; revenue: number | null }[] = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0);

      const revenue = await this.prisma.booking.aggregate({
        where: {
          checkInDate: {
            gte: startDate,
            lte: endDate,
          },
          paymentStatus: 'PAID',
        },
        _sum: {
          totalPrice: true,
        },
      });

      monthlyRevenue.push({
        month,
        revenue: revenue._sum.totalPrice || 0,
      });
    }

    // Get booking status distribution
    const bookingStatusDistribution = await this.prisma.booking.groupBy({
      by: ['bookingStatus'],
      _count: {
        bookingStatus: true,
      },
    });

    // Get villa occupancy rate
    const totalRooms = await this.prisma.room.count();
    const occupiedRooms = await this.prisma.booking.count({
      where: {
        checkInDate: {
          lte: today,
        },
        checkOutDate: {
          gt: today,
        },
        bookingStatus: 'CONFIRMED',
      },
    });

    const occupancyRate =
      totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    return {
      counts: {
        villas: villasCount,
        rooms: roomsCount,
        bookings: bookingsCount,
        users: usersCount,
        staff: staffCount,
      },
      recentBookings,
      upcomingCheckIns,
      monthlyRevenue,
      bookingStatusDistribution,
      occupancyRate: parseFloat(occupancyRate.toFixed(2)),
    };
  }

  async getStaffDashboard(staffId: string) {
    // Get villas assigned to the staff
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

    const villaIds = staffVillas.map((villa) => villa.id);

    // Get today's tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayTasks = await this.prisma.task.findMany({
      where: {
        userId: staffId,
        dueDate: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        villa: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    // Get upcoming check-ins for assigned villas (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingCheckIns = await this.prisma.booking.findMany({
      where: {
        villaId: {
          in: villaIds,
        },
        checkInDate: {
          gte: today,
          lte: nextWeek,
        },
        bookingStatus: 'CONFIRMED',
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
      orderBy: {
        checkInDate: 'asc',
      },
    });

    // Get current guests
    const currentGuests = await this.prisma.booking.findMany({
      where: {
        villaId: {
          in: villaIds,
        },
        checkInDate: {
          lte: today,
        },
        checkOutDate: {
          gt: today,
        },
        bookingStatus: 'CONFIRMED',
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

    // Get pending tasks
    const pendingTasks = await this.prisma.task.count({
      where: {
        userId: staffId,
        completed: false,
        dueDate: {
          lt: today,
        },
      },
    });

    return {
      todayTasks,
      upcomingCheckIns,
      currentGuests,
      pendingTasks,
      assignedVillas: staffVillas.length,
    };
  }
}

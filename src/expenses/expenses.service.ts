import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Expense } from '@prisma/client';
import { CreateExpenseDto } from '../auth/dto/create-expense.dto';
import { UpdateExpenseDto } from '../auth/dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return this.prisma.expense.create({
      data: createExpenseDto,
      include: {
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
  }

  async findAll(): Promise<Expense[]> {
    return this.prisma.expense.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUserId(userId: string): Promise<Expense[]> {
    return this.prisma.expense.findMany({
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Expense | null> {
    return this.prisma.expense.findUnique({
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
      },
    });
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    return this.prisma.expense.update({
      where: { id },
      data: updateExpenseDto,
      include: {
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
  }

  async remove(id: string): Promise<Expense> {
    return this.prisma.expense.delete({
      where: { id },
    });
  }

  async getMonthlyExpenses(year: number, month: number): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const expenses = await this.prisma.expense.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      expenses,
      total,
      month,
      year,
    };
  }

  async getFinancialSummary(year: number): Promise<any> {
    const monthlyData: { month: number; total: any }[] = [];

    for (let month = 1; month <= 12; month++) {
      const monthlyExpenses = await this.getMonthlyExpenses(year, month);
      monthlyData.push({
        month,
        total: monthlyExpenses.total,
      });
    }

    // Get booking income for the year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const bookings = await this.prisma.booking.findMany({
      where: {
        checkInDate: {
          gte: startDate,
          lte: endDate,
        },
        paymentStatus: 'PAID',
      },
      select: {
        totalPrice: true,
        checkInDate: true,
      },
    });

    const monthlyIncome = Array(12).fill(0);

    bookings.forEach((booking) => {
      const month = booking.checkInDate.getMonth();
      monthlyIncome[month] += booking.totalPrice;
    });

    const summary = monthlyData.map((data, index) => ({
      month: data.month,
      expenses: data.total,
      income: monthlyIncome[index],
      profit: monthlyIncome[index] - data.total,
    }));

    return {
      year,
      summary,
      totalIncome: monthlyIncome.reduce((sum, income) => sum + income, 0),
      totalExpenses: monthlyData.reduce((sum, data) => sum + data.total, 0),
      totalProfit:
        monthlyIncome.reduce((sum, income) => sum + income, 0) -
        monthlyData.reduce((sum, data) => sum + data.total, 0),
    };
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Task } from '@prisma/client';
import { CreateTaskDto } from '../auth/dto/create-task.dto';
import { UpdateTaskDto } from '../auth/dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: createTaskDto,
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
      },
    });
  }

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
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
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findByUserId(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
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
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findByVillaId(villaId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { villaId },
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
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findByStaffId(staffId: string): Promise<Task[]> {
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

    // Find tasks for those villas
    return this.prisma.task.findMany({
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
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async findOne(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
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
      },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
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
      },
    });
  }

  async remove(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async markAsCompleted(id: string): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data: { completed: true },
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
      },
    });
  }

  async getUpcomingTasks(days: number = 7): Promise<Task[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return this.prisma.task.findMany({
      where: {
        dueDate: {
          gte: today,
          lte: futureDate,
        },
        completed: false,
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
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }
}
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from '../auth/dto/create-task.dto';
import { UpdateTaskDto } from '../auth/dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/role.decorators';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    // If userId is not provided, use the current user's ID
    if (!createTaskDto.userId) {
      createTaskDto.userId = req.user.id;
    }
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('my-tasks')
  @ApiOperation({ summary: 'Get tasks for current user' })
  @ApiResponse({ status: 200, description: 'User tasks retrieved successfully' })
  findMyTasks(@Request() req) {
    return this.tasksService.findByUserId(req.user.id);
  }

  @Get('staff-tasks')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  @ApiOperation({ summary: 'Get tasks for villas assigned to current staff' })
  @ApiResponse({ status: 200, description: 'Staff tasks retrieved successfully' })
  findStaffTasks(@Request() req) {
    return this.tasksService.findByStaffId(req.user.id);
  }

  @Get('villa/:villaId')
  @ApiOperation({ summary: 'Get tasks for a specific villa' })
  @ApiResponse({ status: 200, description: 'Villa tasks retrieved successfully' })
  findByVilla(@Param('villaId') villaId: string) {
    return this.tasksService.findByVillaId(villaId);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming tasks' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Upcoming tasks retrieved successfully' })
  getUpcomingTasks(@Query('days') days: number = 7) {
    return this.tasksService.getUpcomingTasks(days);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task by ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark task as completed' })
  @ApiResponse({ status: 200, description: 'Task marked as completed' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  markAsCompleted(@Param('id') id: string) {
    return this.tasksService.markAsCompleted(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete task by ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
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
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from '../auth/dto/create-room.dto';
import { UpdateRoomDto } from '../auth/dto/update-room.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/role.decorators';
import { UserRole } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Rooms')
@Controller('rooms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  findAll() {
    return this.roomsService.findAll();
  }

  @Get('villa/:villaId')
  @ApiOperation({ summary: 'Get rooms by villa ID' })
  @ApiResponse({ status: 200, description: 'Rooms retrieved successfully' })
  findByVilla(@Param('villaId') villaId: string) {
    return this.roomsService.findByVillaId(villaId);
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available rooms for specific villa and dates' })
  @ApiQuery({ name: 'villaId', required: true, type: String })
  @ApiQuery({ name: 'checkInDate', required: true, type: String })
  @ApiQuery({ name: 'checkOutDate', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Available rooms retrieved successfully' })
  findAvailable(
    @Query('villaId') villaId: string,
    @Query('checkInDate') checkInDate: string,
    @Query('checkOutDate') checkOutDate: string,
  ) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    return this.roomsService.findAvailableRooms(villaId, checkIn, checkOut);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiResponse({ status: 200, description: 'Room retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update room by ID' })
  @ApiResponse({ status: 200, description: 'Room updated successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete room by ID' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
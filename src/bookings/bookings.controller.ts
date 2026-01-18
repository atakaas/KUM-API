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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from '../auth/dto/create-booking.dto';
import { UpdateBookingDto } from '../auth/dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../common/decorators/role.decorators';
import { UserRole, BookingStatus, PaymentStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    // If userId is not provided, use the current user's ID
    if (!createBookingDto.userId) {
      createBookingDto.userId = req.user.id;
    }
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get bookings for current user' })
  @ApiResponse({ status: 200, description: 'User bookings retrieved successfully' })
  findMyBookings(@Request() req) {
    return this.bookingsService.findByUserId(req.user.id);
  }

  @Get('staff-bookings')
  @UseGuards(RolesGuard)
  @Roles(UserRole.STAFF)
  @ApiOperation({ summary: 'Get bookings for villas assigned to current staff' })
  @ApiResponse({ status: 200, description: 'Staff bookings retrieved successfully' })
  findStaffBookings(@Request() req) {
    return this.bookingsService.findByStaffId(req.user.id);
  }

  @Get('calendar')
  @ApiOperation({ summary: 'Get bookings calendar view' })
  @ApiQuery({ name: 'villaId', required: false, type: String })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Calendar data retrieved successfully' })
  getCalendar(
    @Query('villaId') villaId?: string,
    @Query('year') year?: number,
    @Query('month') month?: number,
  ) {
    return this.bookingsService.getBookingsCalendar(villaId, year, month);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: 200, description: 'Booking status updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  updateBookingStatus(
    @Param('id') id: string,
    @Body('status') status: BookingStatus,
  ) {
    return this.bookingsService.updateBookingStatus(id, status);
  }

  @Patch(':id/payment-status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update payment status' })
  @ApiResponse({ status: 200, description: 'Payment status updated successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  updatePaymentStatus(
    @Param('id') id: string,
    @Body('status') status: PaymentStatus,
  ) {
    return this.bookingsService.updatePaymentStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
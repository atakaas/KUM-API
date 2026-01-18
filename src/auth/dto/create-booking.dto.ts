import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate } from 'class-validator';
import { BookingStatus, PaymentStatus } from '@prisma/client';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  guestName: string;

  @IsString()
  @IsNotEmpty()
  guestEmail: string;

  @IsString()
  @IsNotEmpty()
  guestPhone: string;

  @IsDate()
  @IsNotEmpty()
  checkInDate: Date;

  @IsDate()
  @IsNotEmpty()
  checkOutDate: Date;

  @IsNotEmpty()
  totalPrice: number;

  @IsOptional()
  @IsEnum(BookingStatus)
  bookingStatus?: BookingStatus = BookingStatus.PENDING;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus = PaymentStatus.PENDING;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  villaId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;
}
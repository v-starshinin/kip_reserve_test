import { Controller, Post, Body } from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from '../entities/booking.entity';

@Controller('api/bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('reserve')
  async reserve(@Body() body: { event_id: number; user_id: string }): Promise<Booking> {
    return this.bookingService.reserve(body.event_id, body.user_id);
  }
}

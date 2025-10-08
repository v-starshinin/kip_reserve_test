import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { Event } from '../entities/event.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async reserve(eventId: number, userId: string): Promise<Booking> {
    const existingBooking = await this.bookingRepository.findOne({
      where: { event_id: eventId, user_id: userId },
    });
    if (existingBooking) {
      throw new BadRequestException('User has already booked for this event');
    }

    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new BadRequestException('Event not found');
    }

    const bookingCount = await this.bookingRepository.count({ where: { event_id: eventId } });
    if (bookingCount >= event.total_seats) {
      throw new BadRequestException('No seats available');
    }

    const booking = this.bookingRepository.create({
      event_id: eventId,
      user_id: userId,
    });
    return this.bookingRepository.save(booking);
  }
}

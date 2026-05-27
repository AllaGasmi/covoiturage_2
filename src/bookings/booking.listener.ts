import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingStreamService } from './booking-stream.service';
import type { BookingRequestCreatedEvent } from './booking-stream.service';

@Injectable()
export class BookingListener {
  constructor(private readonly stream: BookingStreamService) {}

  @OnEvent('booking.request.created')
  handleBookingCreated(bookingEvent: BookingRequestCreatedEvent) {
    this.stream.emit(bookingEvent);
  }
}

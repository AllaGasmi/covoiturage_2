import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingStreamService } from './booking-stream.service';
import type { BookingConfirmedEvent, BookingRejectedEvent, BookingRequestCreatedEvent } from './booking-stream.service';

@Injectable()
export class BookingListener {
  constructor(private readonly stream: BookingStreamService) {}

  @OnEvent('booking.request.created')
  handleBookingCreated(bookingEvent: BookingRequestCreatedEvent) {
    this.stream.emit(bookingEvent);
  }
  @OnEvent('booking.confirmed')
  handleBookingConfirmed(bookingEvent: BookingConfirmedEvent) {
    this.stream.emitConfirmed(bookingEvent);
  }
  @OnEvent('booking.rejected')
  handleBookingRejected(bookingEvent: BookingRejectedEvent) {
    this.stream.emitRejected(bookingEvent);
  }
}
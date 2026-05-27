import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Booking } from './entities/booking.entity';

export interface BookingRequestCreatedEvent {
  booking: Booking;
  driverId: number;
}

@Injectable()
export class BookingStreamService {
  private bookingSubject = new Subject<BookingRequestCreatedEvent>();

  stream$ = this.bookingSubject.asObservable();

  emit(bookingEvent: BookingRequestCreatedEvent) {
    this.bookingSubject.next(bookingEvent);
  }
}

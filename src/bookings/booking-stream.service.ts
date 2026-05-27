import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Booking } from './entities/booking.entity';

export interface BookingRequestCreatedEvent {
  booking: Booking;
  driverId: number;
}
export interface BookingConfirmedEvent {
  bookingId: number;
  passengerId: number;
  tripId: number;
}

export interface BookingRejectedEvent {
  bookingId: number;
  passengerId: number;
  tripId: number;
}

@Injectable()
export class BookingStreamService {
  private bookingSubject = new Subject<BookingRequestCreatedEvent>();
  stream$ = this.bookingSubject.asObservable();
  emit(bookingEvent: BookingRequestCreatedEvent) {
    this.bookingSubject.next(bookingEvent);
  }

  private confirmedSubject = new Subject<BookingConfirmedEvent>();
  confirmed$ = this.confirmedSubject.asObservable();
  emitConfirmed(event: BookingConfirmedEvent) { this.confirmedSubject.next(event); }

  private rejectedSubject = new Subject<BookingRejectedEvent>();
  rejected$ = this.rejectedSubject.asObservable();
  emitRejected(event: BookingRejectedEvent) { this.rejectedSubject.next(event); }

}
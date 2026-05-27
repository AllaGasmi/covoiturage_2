import { Controller, Param, ParseIntPipe, Sse } from '@nestjs/common';
import { filter, map } from 'rxjs/operators';
import { BookingStreamService } from './booking-stream.service';

@Controller('bookings')
export class BookingSseController {
  constructor(private readonly stream: BookingStreamService) {}

  @Sse('stream')
  streamAllBookings() {
    return this.stream.stream$.pipe(
      map((event) => ({
        type: 'booking.request.created',
        data: event,
      })),
    );
  }

  @Sse('stream/driver/:driverId')
  streamDriverBookings(@Param('driverId', ParseIntPipe) driverId: number) {
    return this.stream.stream$.pipe(
      filter((event) => event.driverId === driverId),
      map((event) => ({
        type: 'booking.request.created',
        data: event,
      })),
    );
  }
}

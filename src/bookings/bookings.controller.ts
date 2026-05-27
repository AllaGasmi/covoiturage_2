import {Controller, Post, Delete,Patch, Get,Param, Body, ParseIntPipe, UseGuards, Req, Sse} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BookingStreamService } from './booking-stream.service';
import { filter, map, merge } from 'rxjs';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService, private readonly stream: BookingStreamService) {}

  @Post()
  book(@Body() dto: CreateBookingDto,@Req() request: any) {
    const passengerId = request.user.id;
    return this.bookingsService.bookTrip(passengerId, dto.tripId);
  }

  @Delete(':id')
  cancel(@Param('id', ParseIntPipe) id: number,@Req() request: any) {
    const passengerId = request.user.id;
    return this.bookingsService.cancelBooking(id, passengerId);
  }
    @Patch(':id/confirm')
    confirm(@Param('id', ParseIntPipe) id: number,@Req() request: any) {
    const driverId = request.user.id;
    return this.bookingsService.confirmBooking(id, driverId);
    }

    @Patch(':id/reject')
    reject(@Param('id', ParseIntPipe) id: number,@Req() request: any) {
    const driverId = request.user.id;
    return this.bookingsService.rejectBooking(id, driverId);
    }

    @Get('trip/:tripId/pending')
    getPending(@Param('tripId', ParseIntPipe) tripId: number,@Req() request: any) {
    const driverId = request.user.id;
    return this.bookingsService.getPendingBookingsForTrip(tripId, driverId);
    }

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
    @Sse('stream/passenger/:passengerId')
    streamPassengerBookings(@Param('passengerId', ParseIntPipe) passengerId: number) {
      const confirmed$ = this.stream.confirmed$.pipe(
        filter((e) => e.passengerId === passengerId),
        map((e) => ({ type: 'booking.confirmed', data: e })),
      );

      const rejected$ = this.stream.rejected$.pipe(
        filter((e) => e.passengerId === passengerId),
        map((e) => ({ type: 'booking.rejected', data: e })),
      );

      return merge(confirmed$, rejected$); 
    }
}
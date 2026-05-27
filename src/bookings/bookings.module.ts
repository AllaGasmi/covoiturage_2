import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Trip } from '../trips/entities/trip.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingsResolver } from './bookings.resolver';
import { TripCancelledListener } from './trip-cancelled.listener';
import { User } from 'src/users/entities/user.entity';
import { BookingStreamService } from './booking-stream.service';
import { BookingListener } from './booking.listener';
import { BookingSseController } from './booking-sse.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Trip, User]),
  ],
  providers: [
    BookingsService,
    BookingsResolver,
    TripCancelledListener,
    BookingStreamService,
    BookingListener,
  ],
  controllers: [BookingsController, BookingSseController],
  exports: [BookingsService],
})
export class BookingsModule {}

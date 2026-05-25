import {Controller, Post, Delete,Patch, Get,Param, Body, ParseIntPipe} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  book(@Body() dto: CreateBookingDto) {
    const passengerId = 2; // ← remplacer par req.user.id quand auth prête
    return this.bookingsService.bookTrip(passengerId, dto.tripId);
  }

  @Delete(':id')
  cancel(@Param('id', ParseIntPipe) id: number) {
    const passengerId = 2;
    return this.bookingsService.cancelBooking(id, passengerId);
  }
  // Conducteur confirme une réservation
    @Patch(':id/confirm')
    confirm(@Param('id', ParseIntPipe) id: number) {
    const driverId = 1; // ← req.user.id avec auth
    return this.bookingsService.confirmBooking(id, driverId);
    }

    // Conducteur refuse une réservation
    @Patch(':id/reject')
    reject(@Param('id', ParseIntPipe) id: number) {
    const driverId = 1;
    return this.bookingsService.rejectBooking(id, driverId);
    }

    // Conducteur voit les demandes en attente sur son trajet
    @Get('trip/:tripId/pending')
    getPending(@Param('tripId', ParseIntPipe) tripId: number) {
    const driverId = 1;
    return this.bookingsService.getPendingBookingsForTrip(tripId, driverId);
    }
}
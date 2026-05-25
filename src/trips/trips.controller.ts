import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Controller('trips')
// @UseGuards(JwtAuthGuard)  // à activer qd auth mise en place
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body() dto: CreateTripDto) {
    const driverId = 1; // ← remplace par req.user.id avec auth
    return this.tripsService.createTrip(driverId, dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTripDto) {
    const driverId = 1;
    return this.tripsService.updateTrip(id, driverId, dto);
  }

  @Delete(':id')
  cancel(@Param('id', ParseIntPipe) id: number) {
    const driverId = 1;
    return this.tripsService.cancelTrip(id, driverId);
  }

  @Get('mine')
  getMyTrips() {
    const driverId = 1;
    return this.tripsService.getMyTrips(driverId);
  }
}
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripsService } from './trips.service';

@Controller('trips')
// @UseGuards(JwtAuthGuard)  // activate when auth is in place
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body() dto: CreateTripDto) {
    const driverId = 1; // replace with req.user.id once auth is in place
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

  @Get('driver/:driverId')
  getTripsByDriver(@Param('driverId', ParseIntPipe) driverId: number) {
    return this.tripsService.getTripsByDriver(driverId);
  }

  @Patch(':id/complete')
  completeTrip(@Param('id', ParseIntPipe) id: number) {
    return this.tripsService.completeTrip(id);
  }
}

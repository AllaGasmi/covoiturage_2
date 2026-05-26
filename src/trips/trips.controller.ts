import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

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

  @Patch(':id/complete')
  @UseGuards(JwtAuthGuard)
  completeTrip(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.tripsService.completeTrip(id, user.id);
  }
}
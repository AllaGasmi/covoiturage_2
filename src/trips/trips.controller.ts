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
  Req,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('trips')
@UseGuards(JwtAuthGuard)  
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  create(@Body() dto: CreateTripDto,@Req() request: any) {
    const driverId = request.user.id;
    return this.tripsService.createTrip(driverId, dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTripDto,@Req() request: any) {
    const driverId = request.user.id;
    return this.tripsService.updateTrip(id, driverId, dto);
  }

  @Delete(':id')
  cancel(@Param('id', ParseIntPipe) id: number,@Req() request: any) {
    const driverId = request.user.id;
    return this.tripsService.cancelTrip(id, driverId);
  }

  @Get('mine')
  getMyTrips(@Req() request: any) {
    const driverId = request.user.id;
    return this.tripsService.getMyTrips(driverId);
  }
}

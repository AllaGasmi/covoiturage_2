import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Review } from './entities/review.entity';
import { ReviewsResolver } from './reviews.resolver';
import { Trip } from '../trips/entities/trip.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { UserModule } from 'src/user/user.module';
import { TripsModule } from 'src/trips/trips.module';
import { DriverBadge } from './entities/driver-badge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Trip, Booking, DriverBadge]),TripsModule, UserModule,],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsResolver],
})
export class ReviewsModule {}

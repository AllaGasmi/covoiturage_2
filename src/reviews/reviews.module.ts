import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Review } from './entities/review.entity';
import { ReviewsResolver } from './reviews.resolver';
import { Trip } from '../trips/entities/trip.entity';
import { TripsModule } from '../trips/trips.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Trip]), TripsModule],
  
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsResolver],
})
export class ReviewsModule {}

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { Trip } from '../trips/entities/trip.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(Trip)
    private tripRepo: Repository<Trip>,
    private eventEmitter: EventEmitter2,
  ) {}

  async submitReview(body: CreateReviewDto) {
    const review = this.reviewRepo.create({
      rating: body.rating,
      comment: body.comment,
      driver: { id: body.driverId } as any,
      passenger: { id: body.passengerId } as any,
      trip: { id: body.tripId } as any,
    });

     const trip = await this.tripRepo.findOne({ where: { id: body.tripId } });

    if (!trip) throw new NotFoundException('Trajet introuvable');
    if (trip.status !== 'completed') 
      throw new BadRequestException('Ce trajet ne peut pas encore être évalué');
      
    await this.reviewRepo.save(review);

    const avg = await this.getDriverAverageRating(body.driverId);
    this.eventEmitter.emit('review.submitted', { driverId: body.driverId, averageRating: avg });
    return review;
  }

  async getDriverReviews(driverId: number) {
  return this.reviewRepo.find({
    where: { driver: { id: driverId } },
    relations: ['passenger', 'trip'],
    order: { createdAt: 'DESC' },
  });
}

  async getDriverReviewsAdmin(driverId: number) {
    return this.reviewRepo.find({
      where: { driver: { id: driverId } },
      
      order: { createdAt: 'DESC' },
    });
  }

  async getTripReviews(tripId: number) {
    return this.reviewRepo.find({
      where: { trip: { id: tripId } },
      relations: ['driver', 'passenger'],
    });
  }

  async getDriverAverageRating(driverId: number): Promise<number> {
    const result = await this.reviewRepo
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avg')
      .where('review.driverId = :driverId', { driverId })
      .getRawOne();
    return parseFloat(result?.avg ?? '0');
  }
}
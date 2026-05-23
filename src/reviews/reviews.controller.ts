import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Sse } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { filter, from, fromEvent, map, Observable, Subject, switchMap } from 'rxjs';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';


@Controller()
export class ReviewsController {
  constructor(private reviewsService: ReviewsService, private eventEmitter: EventEmitter2) {}

  @Post('reviews')
  submitReview(@Body() body: CreateReviewDto) {
  return this.reviewsService.submitReview(body);
}

  @Get('reviews/driver/:id')
getDriverReviews(@Param('id', ParseIntPipe) id: number) {
  return this.reviewsService.getDriverReviews(id);
}

  @Get('trips/:id/reviews')
  getTripReviews(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.getTripReviews(id);
  }

  @Sse('driver/:id/live')
  streamDriverStats(@Param('id', ParseIntPipe) driverId: number) {
    return fromEvent(this.eventEmitter, 'review.submitted').pipe(
    filter((payload: any) => payload.driverId === driverId),
    map((payload: any) => ({type:'review.submitted', data: { averageRating: payload.averageRating } })),
    );
  }

  @Sse('passenger/:id/reviewnotifications')
  streamPassengerNotifications(@Param('id', ParseIntPipe) passengerId: number): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'trip.completed').pipe(
      filter((payload: any) => payload.passengerIds.includes(passengerId)),
      map((payload: any) => ({
        type: 'trip.completed',
        data: {
          tripId: payload.tripId,
          message: 'Votre trajet est terminé, pensez à évaluer votre conducteur !',
          driverId: payload.driverId,
        },
      } as MessageEvent)),
    );

    }
  

      
  

}

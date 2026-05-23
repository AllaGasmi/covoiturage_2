import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TripsService } from './trips.service';
import { TripType } from './trip.type';

@Resolver(() => TripType)
export class TripsResolver {
  constructor(private readonly tripsService: TripsService) {}

  @Query(() => TripType)
  trip(@Args('id', { type: () => Int }) id: number) {
    return this.tripsService.getTripById(id);
  }

  @Query(() => [TripType])
  upcomingTrips(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ) {
    return this.tripsService.getUpcomingTrips(page, limit);
  }

  @Mutation(() => TripType)
  createTrip(
    @Args('departure') departure: string,
    @Args('destination') destination: string,
    @Args('date') date: string,
    @Args('seats', { type: () => Int }) seats: number,
    @Args('price') price: number,
  ) {
    const driverId = 1;
    return this.tripsService.createTrip(driverId, {
      departure,
      destination,
      date,
      seats,
      price,
    });
  }

  @Mutation(() => TripType)
  cancelTrip(
    @Args('id', { type: () => Int }) id: number,
    @Args('reason', { nullable: true }) reason?: string,
  ) {
    const driverId = 1;
    return this.tripsService.cancelTrip(id, driverId, reason);
  }
}

import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { TripsService } from './trips.service';
import { TripType } from './trip.type';
import { TripStatsType } from './trip-stats.type';

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


  @Query(() => [TripType])
  tripsByStatus(@Args('status') status: string) {
    return this.tripsService.getTripsByStatus(status);
  }


  @Query(() => [TripType])
  searchTrips(
    @Args('departure', { nullable: true }) departure?: string,
    @Args('destination', { nullable: true }) destination?: string,
  ) {
    return this.tripsService.searchTrips(departure, destination);
  }


  @Query(() => TripStatsType)
  tripsStats() {
    const driverId = 1;
    return this.tripsService.getTripsStats(driverId);
  }


  @Query(() => [TripType])
  tripsByDateRange(@Args('from') from: string, @Args('to') to: string) {
    return this.tripsService.getTripsByDateRange(from, to);
  }

  @Query(() => [TripType])
  cheapestTrips(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ) {
    return this.tripsService.getCheapestTrips(limit);
  }
}
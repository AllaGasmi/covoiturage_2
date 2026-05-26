import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { TripsService } from './trips.service';
import { TripType } from './graphql/trip.type';
import { TripStatsType } from './graphql/trip-stats.type';
import { PaginatedTripsType } from './graphql/paginated-trips.type';
import { SearchTripsInput } from './graphql/search-trips.input';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => TripType)
export class TripsResolver {
  constructor(private readonly tripsService: TripsService) {}


  @Query(() => TripType)
  @UseGuards(GqlJwtAuthGuard)
  trip(@Args('id', { type: () => Int }) id: number) {
    return this.tripsService.getTripById(id);
  }


  @Query(() => [TripType])
  @UseGuards(GqlJwtAuthGuard)
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


  @Query(() => PaginatedTripsType)
    searchTrips(
      @Args('filters', { type: () => SearchTripsInput, nullable: true })
      filters?: SearchTripsInput,
    ) {
      return this.tripsService.searchTrips(filters ?? {});
    }



  @Query(() => TripStatsType)
  @UseGuards(GqlJwtAuthGuard)
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


  @Query(() => [TripType])
  tripsNearDate(
    @Args('date') date: string,
    @Args('rangeDays', { type: () => Int }) rangeDays: number,
  ) {
    return this.tripsService.tripsNearDate(date, rangeDays);
  }
}
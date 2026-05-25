import { Resolver, Query, Args, Int, ResolveField, Parent, Context } from '@nestjs/graphql';
import { TripsService } from './trips.service';
import { TripType } from './graphql/trip.type';
import { TripStatsType } from './graphql/trip-stats.type';
import { SearchTripsInput } from './graphql/search-trips.input';
import { PaginatedTripsType } from './graphql/paginated-trips.type';
import { DriverProfileType } from './graphql/driver-profile.type';
import { DriverLoader } from './driver.loader';
import { Trip } from './entities/trip.entity';

@Resolver(() => TripType)
export class TripsResolver {
  constructor(
    private readonly tripsService: TripsService,
    private readonly driverLoader: DriverLoader,
  ) { }


  @Query(() => TripType)
  trip(@Args('id', { type: () => Int }) id: number) {
    return this.tripsService.getTripById(id);
  }


  @Query(() => PaginatedTripsType)
  searchTrips(
    @Args('filters', { type: () => SearchTripsInput, nullable: true })
    filters?: SearchTripsInput,
  ) {
    return this.tripsService.searchTrips(filters ?? {});
  }


  @Query(() => [TripType])
  tripsNearDate(
    @Args('date') date: string,
    @Args('rangeDays', { type: () => Int }) rangeDays: number,
  ) {
    return this.tripsService.tripsNearDate(date, rangeDays);
  }


  @Query(() => [TripType])
  tripsByStatus(@Args('status') status: string) {
    return this.tripsService.getTripsByStatus(status);
  }


  @Query(() => TripStatsType)
  tripsStats(@Context() context: any) {
    const driverId = context.req.user.id;
    return this.tripsService.getTripsStats(driverId);
  }


  @ResolveField('driver', () => DriverProfileType, { nullable: true })
  async resolveDriver(@Parent() trip: Trip) {
    return this.driverLoader.loader.load(trip.driverId);
  }

}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { Trip } from './entities/trip.entity';
import { Driver } from 'src/users/entities/driver.entity';
import { PassengerAlert } from './entities/passenger-alert.entity';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { TripsResolver } from './trips.resolvers';
import { DriverLoader } from './driver.loader';
import { TripCreatedListener } from './trip-created.listener';
import { SHARED_PUBSUB } from './trip-created.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Driver, PassengerAlert])],
  controllers: [TripsController],
  providers: [
    TripsService,
    TripsResolver,
    DriverLoader,
    TripCreatedListener,
    {
      provide: SHARED_PUBSUB,
      useValue: new PubSub(),
    },
  ],
  exports: [TripsService],
})
export class TripsModule { }

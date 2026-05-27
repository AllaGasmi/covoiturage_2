import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingsService } from './bookings.service';

@Injectable()
export class TripUpdatedListener {
  private readonly logger = new Logger(TripUpdatedListener.name);

  constructor(private readonly bookingsService: BookingsService) {}

  @OnEvent('trip.updated')
  async handleTripUpdated(payload: {
    tripId: number;
    updatedFields: string[];
    newValues: Record<string, any>;
  }) {
    this.logger.log(
      `Trip #${payload.tripId} mis à jour: ${payload.updatedFields.join(', ')}`,
    );
    await this.bookingsService.notifyPassengersOfTripUpdate(
      payload.tripId,
      payload.updatedFields,
      payload.newValues,
    );
  }
}

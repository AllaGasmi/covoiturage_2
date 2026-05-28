import { Injectable, Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PubSub } from 'graphql-subscriptions';
import { SHARED_PUBSUB } from '../common/pubsub/pubsub.module';
import { NotificationsService } from './notifications.service';

export const TOPIC_BOOKING_CONFIRMED = 'bookingConfirmed';
export const TOPIC_BOOKING_CANCELED = 'bookingCanceled';
export const TOPIC_BOOKING_REJECTED = 'bookingRejected';
//already done 
export const TOPIC_TRIP_CANCELLED = 'tripCancelled';

@Injectable()
export class NotificationsListener {
  private readonly logger = new Logger(NotificationsListener.name);

  constructor(
    @Inject(SHARED_PUBSUB)
    private readonly pubSub: PubSub,
    private readonly notificationsService: NotificationsService,
  ) {}

  @OnEvent('booking.confirmed')
  async handleBookingConfirmed(payload: {
    bookingId: number;
    passengerId: number;
    tripId: number;
  }) {
    this.logger.log(`Booking #${payload.bookingId} confirmed → saving to DB`);
    // Save to DB
    await this.notificationsService.saveNotification(
      payload.passengerId,
      'booking_confirmed',
      `Votre réservation #${payload.bookingId} a été confirmée`,
      payload,
    );
    // Push via WebSocket
    await this.pubSub.publish(TOPIC_BOOKING_CONFIRMED, {
      bookingConfirmed: payload,
    });
  }

  @OnEvent('trip.cancelled')
  async handleTripCancelled(payload: {
    tripId: number;
    reason: string;
    passengerIds?: number[];
  }) {
    this.logger.log(`Trip #${payload.tripId} cancelled → saving to DB`);
    // Save to DB for all affected passengers
    for (const userId of payload.passengerIds ?? []) {
      await this.notificationsService.saveNotification(
        userId,
        'trip_cancelled',
        `Le trajet #${payload.tripId} a été annulé : ${payload.reason}`,
        payload,
      );
    }
    // Push via WebSocket
    await this.pubSub.publish(TOPIC_TRIP_CANCELLED, {
      tripCancelled: payload,
    });
  }
}

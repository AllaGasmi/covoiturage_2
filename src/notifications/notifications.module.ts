import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerAlert } from '../trips/entities/passenger-alert.entity';
import { Notification } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsListener } from './notifications.listener';
import { AlertsController } from './alerts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PassengerAlert, Notification])],
  providers: [NotificationsService, NotificationsResolver, NotificationsListener],
  controllers: [AlertsController],
})
export class NotificationsModule {}

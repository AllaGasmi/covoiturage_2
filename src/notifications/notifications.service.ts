import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassengerAlert } from '../trips/entities/passenger-alert.entity';
import { Notification } from './entities/notification.entity';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(PassengerAlert)
    private alertRepo: Repository<PassengerAlert>,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async createAlert(passengerId: number, dto: CreateAlertDto): Promise<PassengerAlert> {
    const alert = this.alertRepo.create({
      passengerId,
      departure: dto.departure,
      destination: dto.destination,
      date: dto.date ? new Date(dto.date) : undefined,
    });
    return this.alertRepo.save(alert);
  }

  async deleteAlert(alertId: number, passengerId: number): Promise<{ message: string }> {
    const alert = await this.alertRepo.findOne({ where: { id: alertId } });
    if (!alert) throw new NotFoundException('Alerte introuvable');
    if (alert.passengerId !== passengerId)
      throw new ForbiddenException('Pas ton alerte');
    await this.alertRepo.remove(alert);
    return { message: 'Alerte supprimée' };
  }

  async getMyAlerts(passengerId: number): Promise<PassengerAlert[]> {
    return this.alertRepo.find({ where: { passengerId } });
  }

  async saveNotification(
    userId: number,
    type: string,
    message: string,
    data: any,
  ): Promise<Notification> {
    const notif = this.notificationRepo.create({ userId, type, message, data });
    return this.notificationRepo.save(notif);
  }

  async getMyNotifications(userId: number): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markAsRead(
    notifId: number,
    userId: number,
  ): Promise<Notification> {
    const notif = await this.notificationRepo.findOne({
      where: { id: notifId, userId },
    });
    if (!notif) throw new NotFoundException('Notification non trouvée');
    notif.isRead = true;
    return this.notificationRepo.save(notif);
  }

  async markAllAsRead(userId: number): Promise<{ message: string }> {
    await this.notificationRepo.update(
      { userId, isRead: false },
      { isRead: true },
    );
    return { message: 'Toutes les notifications lues' };
  }
}

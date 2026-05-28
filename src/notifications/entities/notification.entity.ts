import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  type: string; // 'trip_matched', 'booking_confirmed', 'trip_cancelled'

  @Column()
  message: string;

  @Column({ type: 'json', nullable: true })
  data: any; // { tripId, bookingId, etc }

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

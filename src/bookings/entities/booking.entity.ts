import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Trip } from 'src/trips/entities/trip.entity';

@Entity('bookings')
@Index(['passengerId', 'tripId'])
@Index(['passengerId', 'status'])
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  passengerId: number;

  @Column()
  tripId: number;

  @Column({ default: 'pending' })
  status: string; // pending, confirmed, cancelled, completed

  @Column({ default: 1 })
  seatsBooked: number;

  @Column({ nullable: true })
  pickupLocation: string;

  @Column({ nullable: true })
  dropoffLocation: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  totalPrice: number;

  @CreateDateColumn()
  bookedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true, type: 'datetime' })
  cancelledAt: Date;

  @Column({ nullable: true })
  cancellationReason: string;



  @ManyToOne(() => Trip, (trip) => trip.bookings, { eager: false })
  @JoinColumn({ name: 'tripId' })
  trip: Trip;
}

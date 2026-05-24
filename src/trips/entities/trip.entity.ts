import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Driver } from '../../users/entities/driver.entity';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  departure: string;

  @Column()
  destination: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column()
  seats: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'active' })
  status: string;

  @Column()
  driverId: number;

  @ManyToOne(() => Driver, (driver) => driver.trips, { eager: false })
  @JoinColumn({ name: 'driverId' })
  driver: Driver;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  carModel: string;

  @Column({ default: 0 })
  seatsBooked: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

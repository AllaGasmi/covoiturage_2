// src/reviews/review.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Trip } from '../../trips/entities/trip.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  rating: number; // 1–5

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => User)
  passenger: User;


  @Column({ nullable: true })
  passengerId: number; 

  @ManyToOne(() => User)
  driver: User;

  @Column()
  driverId: number;

  @ManyToOne(() => Trip)
  trip: Trip;

  @Column()
  tripId: number;

  @CreateDateColumn()
  createdAt: Date;
}
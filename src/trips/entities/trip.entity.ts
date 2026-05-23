import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  departure: string;

  @Column()
  destination: string;

  @Column()
  date: Date;

  @Column()
  seats: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'active' })
  status: string;

  @Column()
  driverId: number;

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

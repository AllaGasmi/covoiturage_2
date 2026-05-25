import {  Entity, PrimaryGeneratedColumn, Column,CreateDateColumn, UpdateDateColumn,} from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  passengerId: number;

  @Column()
  tripId: number;

  @Column({ default: 'confirmed' })
  status: string;

  @Column({ nullable: true })
  cancelReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
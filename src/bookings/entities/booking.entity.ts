import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tripId: number;

  @Column()
  passengerId: number;

  @Column({ type: 'varchar', default: 'confirmed' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;



}
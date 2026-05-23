import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { UserRole } from '../enums/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BOTH })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}
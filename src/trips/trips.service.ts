import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Trip } from './entities/trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private tripRepo: Repository<Trip>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createTrip(driverId: number, dto: CreateTripDto) {
    const trip = this.tripRepo.create({
      ...dto,
      date: new Date(dto.date),
      driverId,
    });
    const saved = await this.tripRepo.save(trip);

    this.eventEmitter.emit('trip.created', { tripId: saved.id, trip: saved });

    return saved;
  }

  async updateTrip(tripId: number, driverId: number, dto: UpdateTripDto) {
    const trip = await this.tripRepo.findOne({ where: { id: tripId } });

    if (!trip) throw new NotFoundException('Trajet introuvable');
    if (trip.driverId !== driverId)
      throw new ForbiddenException('Pas ton trajet');
    if (trip.status !== 'active')
      throw new BadRequestException('Trajet annulé ou terminé');
    if (new Date(trip.date) <= new Date())
      throw new BadRequestException('Trajet déjà parti');

    Object.assign(trip, {
      ...(dto.departure && { departure: dto.departure }),
      ...(dto.destination && { destination: dto.destination }),
      ...(dto.date && { date: new Date(dto.date) }),
      ...(dto.seats !== undefined && { seats: dto.seats }),
      ...(dto.price !== undefined && { price: dto.price }),
    });

    return this.tripRepo.save(trip);
  }

  async cancelTrip(tripId: number, driverId: number, reason?: string) {
    const trip = await this.tripRepo.findOne({ where: { id: tripId } });

    if (!trip) throw new NotFoundException('Trajet introuvable');
    if (trip.driverId !== driverId)
      throw new ForbiddenException('Pas ton trajet');
    if (trip.status !== 'active')
      throw new BadRequestException('Trajet déjà annulé');

    trip.status = 'cancelled';
    const updated = await this.tripRepo.save(trip);

    this.eventEmitter.emit('trip.cancelled', {
      tripId: trip.id,
      reason: reason ?? 'Annulé par le conducteur',
    });

    return updated;
  }

  async getMyTrips(driverId: number) {
    return this.tripRepo.find({
      where: { driverId },
      order: { date: 'DESC' },
    });
  }

  async getTripById(tripId: number) {
    const trip = await this.tripRepo.findOne({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trajet introuvable');
    return trip;
  }

  async getUpcomingTrips(page = 1, limit = 10) {
    const [trips, total] = await this.tripRepo.findAndCount({
      where: {
        status: 'active',
        date: MoreThanOrEqual(new Date()),
      },
      order: { date: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return trips;
  }

  async completeTrip(tripId: number) {
    const trip = await this.tripRepo.findOne({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trajet introuvable');
    trip.status = 'completed';
    const updated = await this.tripRepo.save(trip);
    this.eventEmitter.emit('trip.completed', { tripId });
    return updated;
  }

  async getTripsByDateRange(from: string, to: string) {
    return this.tripRepo
      .createQueryBuilder('trip')
      .where('trip.status = :status', { status: 'active' })
      .andWhere('trip.date BETWEEN :from AND :to', {
        from: new Date(from),
        to: new Date(to),
      })
      .orderBy('trip.date', 'ASC')
      .getMany();
  }


  async getCheapestTrips(limit = 5) {
    return this.tripRepo.find({
      where: {
        status: 'active',
        date: MoreThanOrEqual(new Date()),
      },
      order: { price: 'ASC' },
      take: limit,
    });
  }

  async searchTrips(departure?: string, destination?: string) {
    const query = this.tripRepo
      .createQueryBuilder('trip')
      .where('trip.status = :status', { status: 'active' })
      .andWhere('trip.date >= :now', { now: new Date() });

    if (departure) {
      query.andWhere('trip.departure LIKE :departure', {
        departure: `%${departure}%`,
      });
    }

    if (destination) {
      query.andWhere('trip.destination LIKE :destination', {
        destination: `%${destination}%`,
      });
    }

    return query.orderBy('trip.date', 'ASC').getMany();
  }


  async getTripsStats(driverId: number) {
    const trips = await this.tripRepo.find({ where: { driverId } });

    return {
      totalTrips: trips.length,
      activeTrips: trips.filter((t) => t.status === 'active').length,
      completedTrips: trips.filter((t) => t.status === 'completed').length,
      cancelledTrips: trips.filter((t) => t.status === 'cancelled').length,
      totalSeats: trips.reduce((sum, t) => sum + t.seats, 0),
    };
  }

  async getTripsByStatus(status: string) {
    return this.tripRepo.find({
      where: { status },
      order: { date: 'ASC' },
    });
  }

  async countCompletedTripsByDriver(driverId: number): Promise<number> {
    return this.tripRepo.count({
      where: { driverId, status: 'completed' },
    });
  }
}
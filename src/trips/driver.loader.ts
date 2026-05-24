import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import DataLoader from 'dataloader';
import { Driver } from 'src/users/entities/driver.entity';

@Injectable({ scope: Scope.REQUEST })
export class DriverLoader {
  public readonly loader: DataLoader<number, Driver | null>;

  constructor(
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,
  ) {
    this.loader = new DataLoader<number, Driver | null>(
      (ids) => this.batchLoad(ids as number[]),
    );
  }

  private async batchLoad(driverIds: number[]): Promise<(Driver | null)[]> {
    const drivers = await this.driverRepo.find({
      where: { id: In(driverIds) },
    });

    const driverMap = new Map(drivers.map((d) => [d.id, d]));
    return driverIds.map((id) => driverMap.get(id) ?? null);
  }
}

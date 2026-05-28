import { IsString, IsOptional, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateAlertDto {
  @IsOptional()
  @IsString()
  // @Transform(({ value }) => value?.trim())
  @Type(() => String)
  departure?: string;

  @IsOptional()
  @IsString()
  // @Transform(({ value }) => value?.trim())
  @Type(() => String)
  destination?: string;

  @IsOptional()
  @IsDateString()
  // @Transform(({ value }) => value?.trim())
  @Type(() => String)
  date?: string;
}

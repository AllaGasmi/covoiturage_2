import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  driverId: number;

  @IsInt()
  passengerId: number;

  @IsInt()
  tripId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
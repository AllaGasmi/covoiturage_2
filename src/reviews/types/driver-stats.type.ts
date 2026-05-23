import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class RatingDistribution {
  @Field(() => Int)
  stars: number;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class DriverStats {
  @Field(() => Float)
  averageRating: number;

  @Field(() => Int)
  totalReviews: number;

  @Field(() => Int)
  totalTrips: number;

  @Field(() => [RatingDistribution])
  distribution: RatingDistribution[];
}
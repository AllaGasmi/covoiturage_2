import { ObjectType, Field, Int, Float, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class TripType {
  @Field(() => Int)
  id: number;

  @Field()
  departure: string;

  @Field()
  destination: string;

  @Field(() => GraphQLISODateTime)
  date: Date;

  @Field(() => Int)
  seats: number;

  @Field(() => Float)
  price: number;

  @Field()
  status: string;

  @Field(() => Int)
  driverId: number;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  carModel: string;

  @Field(() => Int)
  seatsBooked: number;

  @Field()
  createdAt: Date;
}

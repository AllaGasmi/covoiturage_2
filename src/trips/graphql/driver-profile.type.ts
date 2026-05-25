import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class DriverProfileType {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Float)
  rating: number;
}

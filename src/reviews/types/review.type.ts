import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ReviewType {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  rating: number;

  @Field({ nullable: true })
  comment?: string;

  @Field(() => Int, { nullable: true })
  passengerId?: number; // only visible to admin

  @Field()
  createdAt: Date;
}
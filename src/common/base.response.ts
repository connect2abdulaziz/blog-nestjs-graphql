import { ObjectType, Field,  } from '@nestjs/graphql';

// ObjectType for User (use this for returning data)
@ObjectType()
export class BaseObjectType{
  @Field()
  id: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

// Generic AuthResponse class for all types of responses
@ObjectType()
export class BaseResponse{
  @Field()
  statusCode?: number;

  @Field()
  message?: string;

}

@ObjectType()
export class PaginatedResponse {
  @Field()
  statusCode?: number;

  @Field()
  message?: string;

  @Field()
  currentPage: number;

  @Field()
  pageSize: number;

  @Field()
  totalPages: number;

  @Field()
  totalCount: number;
}

import { ObjectType, Field } from '@nestjs/graphql';
import { PaginatedResponse, BaseResponse } from 'src/common/base.response';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class UserResponse extends BaseResponse {
  @Field(() => User, { nullable: true })
  data?: User; // Generic array type with nullable data
}

// Generic AuthResponse class for all types of responses
@ObjectType()
export class PaginatedUserResponse extends PaginatedResponse {
  @Field(() => [User], { nullable: true })
  data?: User[]; // Generic array type with nullable data
}




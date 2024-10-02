import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

// Generic ApiResponse class for all types of responses
@ObjectType()
export class ApiResponse<T> {
  @Field()
  status: 'success' | 'error';  // Response status

  @Field()
  message: string;               // Message giving context to the response

  @Field() // Specify that `data` can be any object type
  data: boolean;
}

@ObjectType()
export class data {
  @Field(() => Object, { nullable: true })
  user: User;
}

// Specific response for login
@ObjectType()
export class LoginResponse {
  @Field()
  id: number; // Use number or string based on your user ID type

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

import { ObjectType, Field } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/base.response';

// Specific response for login
@ObjectType()
export class LoginData {
  @Field()
  id: number; // Use number or string based on your user ID type

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

// Generic AuthResponse class for all types of responses
@ObjectType()
export class AuthResponse  extends BaseResponse {
  
  @Field(() => LoginData, { nullable: true }) // Specify that `data` can be a LoginData object
  data?: LoginData; // Use `?` to indicate that this field can be optional
}

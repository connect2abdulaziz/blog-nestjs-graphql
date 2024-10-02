import { ObjectType, Field } from '@nestjs/graphql';


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

// Generic ApiResponse class for all types of responses
@ObjectType()
export class ApiResponse {
  @Field()
  statusCode: number;  

  @Field()
  message: string;               // Message giving context to the response

  @Field(() => LoginData, { nullable: true }) // Specify that `data` can be a LoginData object
  data?: LoginData;              // Use `?` to indicate that this field can be optional
}


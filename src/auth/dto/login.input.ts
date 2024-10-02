import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

@InputType()
export class LoginInput {
  @Field() // GraphQL field for email
  @IsNotEmpty({ message: 'Email should not be empty.' }) // Custom message for not empty
  @IsEmail({}, { message: 'Invalid email format.' }) // Custom message for invalid email format
  readonly email: string;

  @Field() // GraphQL field for password
  @IsNotEmpty({ message: 'Password should not be empty.' }) // Custom message for not empty
  @IsString({ message: 'Password must be a string.' }) // Custom message for non-string
  readonly password: string;
}

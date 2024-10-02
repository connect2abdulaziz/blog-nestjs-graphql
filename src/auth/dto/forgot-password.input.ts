import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail } from 'class-validator';

@InputType()
export class ForgotPasswordInput {
  @Field() // Expose the email field to GraphQL
  @IsNotEmpty({ message: 'Email should not be empty.' }) // Custom message for not empty
  @IsEmail({}, { message: 'Invalid email format.' }) // Custom message for email format
  readonly email: string;
}

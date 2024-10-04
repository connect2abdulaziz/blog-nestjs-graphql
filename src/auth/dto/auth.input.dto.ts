import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator';
import { Match } from '../../decorators/match.decorator';

@InputType()
export class SignupInput {
  @Field() // GraphQL field
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  readonly firstName: string;

  @Field() // GraphQL field
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  readonly lastName: string;

  @Field() // GraphQL field
  @IsNotEmpty({ message: 'Email address is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  readonly email: string;

  @Field() // GraphQL field
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: "Password must be a string." })
  @Length(8, 50, {
    message: "Password must be at least 8 characters long and at most 50 characters long."
  })
  @Matches(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  @Matches(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
  @Matches(/[0-9]/, { message: "Password must contain at least one number." })
  @Matches(/[@$!%*?&]/, { message: "Password must contain at least one special character." })
  readonly password: string;

  @Field() // GraphQL field
  @IsNotEmpty({ message: 'Please confirm your password' })
  @IsString({ message: 'Confirm password must be a string' })
  @Validate(Match, ['password'], {
    message: 'Passwords do not match',
  })
  readonly confirmPassword: string;
}




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





@InputType() // Mark as a GraphQL Input Type
export class ResetPasswordInput {
  @Field() // Expose newPassword to the GraphQL schema
  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'New password must be a string' })
  @Length(8, 50, {
    message: "New password must be at least 8 characters long and at most 50 characters long."
  })
  @Matches(/[A-Z]/, { message: "New password must contain at least one uppercase letter." })
  @Matches(/[a-z]/, { message: "New Password must contain at least one lowercase letter." })
  @Matches(/[0-9]/, { message: "New password must contain at least one number." })
  @Matches(/[@$!%*?&]/, { message: "New password must contain at least one special character." })
  readonly newPassword: string;
}



@InputType()
export class ForgotPasswordInput {
  @Field() // Expose the email field to GraphQL
  @IsNotEmpty({ message: 'Email should not be empty.' }) // Custom message for not empty
  @IsEmail({}, { message: 'Invalid email format.' }) // Custom message for email format
  readonly email: string;
}

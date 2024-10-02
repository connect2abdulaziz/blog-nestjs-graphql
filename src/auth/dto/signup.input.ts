import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
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
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  readonly password: string;

  @Field() // GraphQL field
  @IsNotEmpty({ message: 'Please confirm your password' })
  @IsString({ message: 'Confirm password must be a string' })
  @Validate(Match, ['password'], {
    message: 'Passwords do not match',
  })
  readonly confirmPassword: string;
}

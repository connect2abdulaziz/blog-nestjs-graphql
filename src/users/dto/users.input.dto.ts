import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  IsEmail,
  Matches,
} from 'class-validator';

@InputType()
export class GetUserInput {
  @Field(() => Number)
  @IsNumber({}, { message: 'User ID must be a number' }) // Validating that ID is a number
  id: number;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean({
    message: 'includePosts must be a boolean value (true or false)',
  }) // Ensuring it's a boolean
  includePosts?: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean({
    message: 'includeComments must be a boolean value (true or false)',
  }) // Ensuring it's a boolean
  includeComments?: boolean;
}




@InputType()
export class UpdateUserInput {
  @Field({ nullable: true }) 
  @IsOptional()
  @IsEmail({}, { message: "Email must be a valid email address." })
  email?: string;

  @Field({ nullable: true }) 
  @IsOptional()
  @IsString({ message: "First name must be a string." })
  @Length(2, 30, {
    message: "First name must be between 2 and 30 characters long."
  })
  firstName?: string;

  @Field({ nullable: true }) 
  @IsOptional()
  @IsString({ message: "Last name must be a string." })
  @Length(2, 30, {
    message: "Last name must be between 2 and 30 characters long."
  })
  lastName?: string;

  @Field({ nullable: true }) 
  @IsOptional()
  @IsString({ message: "Password must be a string." })
  @Length(8, 50, {
    message: "Password must be at least 8 characters long and at most 50 characters long."
  })
  @Matches(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  @Matches(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
  @Matches(/[0-9]/, { message: "Password must contain at least one number." })
  @Matches(/[@$!%*?&]/, { message: "Password must contain at least one special character." })
  password?: string;
}

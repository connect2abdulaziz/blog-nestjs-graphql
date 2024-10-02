import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType() // Mark as a GraphQL Input Type
export class ResetPasswordInput {
  @Field() // Expose newPassword to the GraphQL schema
  @IsNotEmpty({ message: 'New password is required' })
  @IsString({ message: 'New password must be a string' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  )
  readonly newPassword: string;
}

import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsOptional,
  IsString,
  IsIn,
  Min,
  Max,
} from 'class-validator';

@InputType()
export class FilterInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt({ message: 'Page must be an integer.' })
  @Min(1, { message: 'Page must be at least 1.' })
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsInt({ message: 'Limit must be an integer.' })
  @Min(1, { message: 'Limit must be at least 1.' })
  @Max(100, { message: 'Limit must not exceed 100.' })
  limit: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'SortBy must be a string.' })
  sortBy?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'SortOrder must be either "asc" or "desc".',
  })
  sortOrder?: 'asc' | 'desc';

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'Role must be a string.' })
  role?: string; 

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'Comment ID must be an integer.' })
  commentId?: number; 

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'Post ID must be an integer.' })
  postId?: number; 
}

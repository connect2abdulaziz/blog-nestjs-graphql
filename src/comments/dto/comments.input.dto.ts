import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsNumber,
  IsInt,
  IsOptional,
  IsString,
  Length,
  IsBoolean,
} from 'class-validator';

@InputType()
export class GetCommentInput {
  @Field({nullable: true, defaultValue: null })
  @IsInt({ message: 'Comment ID must be an integer.' })
  id?: number;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean({
    message: 'includeReplies must be a boolean value (true or false)',
  })
  includeReplies?: boolean; 
}

@InputType()
export class CreateCommentInput {
  @Field()
  @IsString({ message: 'Content must be a string.' })
  @Length(1, 500, { message: 'Content must be between 1 and 500 characters long.' })
  content: string; 

  @Field(() => Int)
  @IsInt({ message: 'Post ID must be an integer.' })
  postId: number; 

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'Parent Comment ID must be an integer.' })
  parentId?: number; 
}

@InputType()
export class UpdateCommentInput {
  @Field()
  @IsInt({ message: 'Comment ID must be an integer.' })
  id: number;
  
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Content must be a string.' })
  @Length(1, 500, { message: 'Content must be between 1 and 500 characters long.' })
  content?: string; 
}

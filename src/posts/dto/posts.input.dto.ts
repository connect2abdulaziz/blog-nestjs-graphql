import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, Length, IsOptional, IsNumber } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field()
  @IsString({ message: 'Title must be a string.' })
  @Length(1, 100, {
    message: 'Title must be between 1 and 100 characters long.',
  })
  title: string;

  @Field()
  @IsString({ message: 'Content must be a string.' })
  @Length(1, 5000, {
    message: 'Content must be between 1 and 5000 characters long.',
  })
  content: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Tag must be a string.' })
  tag?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'Thumbnail must be a string.' })
  thumbnail?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'Cover Image must be a string.' })
  coverImage?: string;
}

@InputType()
export class UpdatePostInput {
  @Field(() => Int)
  @IsNumber({}, { message: 'Post ID must be a number.' })
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  @Length(1, 100, {
    message: 'Title must be between 1 and 100 characters long.',
  })
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Content must be a string.' })
  @Length(1, 5000, {
    message: 'Content must be between 1 and 5000 characters long.',
  })
  content?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Tag must be a string.' })
  tag?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'Thumbnail must be a string.' })
  thumbnail?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'Cover Image must be a string.' })
  coverImage?: string;
}

@InputType()
export class GetPostInput {
  @Field(() => Int)
  @IsNumber({}, { message: 'Post ID must be a number' })
  id: number;
}


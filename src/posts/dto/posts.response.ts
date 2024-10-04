import { ObjectType, Field } from '@nestjs/graphql';
import { PaginatedResponse, BaseResponse } from 'src/common/base.response';
import { Post } from'src/posts/entities/post.entity';



// Generic AuthResponse class for all types of responses
@ObjectType()
export class PostResponse  extends BaseResponse{

  @Field(() => Post, { nullable: true })
  data?: Post; // Generic array type with nullable data
}

@ObjectType()
export class PaginatedPostResponse extends PaginatedResponse{

  @Field(() => [Post], { nullable: true })
  data?: Post[]; // Generic array type with nullable data
}

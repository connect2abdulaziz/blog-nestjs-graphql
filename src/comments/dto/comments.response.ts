import { ObjectType, Field} from '@nestjs/graphql';
import { PaginatedResponse, BaseResponse } from 'src/common/base.response';
import { Comment } from '../entities/comment.entity';



// Generic AuthResponse class for all types of responses
@ObjectType()
export class CommentResponse extends BaseResponse{

  @Field(() => Comment, { nullable: true })
  data?: Comment; 
}

@ObjectType()
export class PaginatedCommentResponse extends PaginatedResponse {

  @Field(() => [Comment], { nullable: true })
  data?: Comment[]; // Generic array type with nullable data

}

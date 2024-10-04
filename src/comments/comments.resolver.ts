import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common'; 
import { CommentsService } from 'src/comments/comments.service';
import { Comment } from 'src/comments/entities/comment.entity';
import { GetCommentInput, UpdateCommentInput, CreateCommentInput } from 'src/comments/dto/comments.input.dto';
import { CommentResponse, PaginatedCommentResponse } from './dto/comments.response';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUserId } from 'src/decorators/get-user-id.decorator';
import { FilterInput } from 'src/common/pagenated.input';

@UseGuards(AuthGuard) 
@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentsService: CommentsService) {}

  // Query to get a single comment by ID
  @Query(() => CommentResponse, { name: 'comment' })
  async getComment(@Args('getCommentInput') getCommentInput: GetCommentInput): Promise<CommentResponse> {
    return this.commentsService.findOne(getCommentInput);
  }

  // Query to get all comments with optional filtering
  @Query(() => PaginatedCommentResponse, { name: 'comments' })
  async getComments(@Args('filter') filter: FilterInput): Promise<PaginatedCommentResponse> {
    return this.commentsService.findAll(filter);
  }

  // Mutation to create a new comment
  @Mutation(() => CommentResponse, { name: 'createComment' })
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput, 
    @GetUserId() userId: number
  ): Promise<CommentResponse> {
    return this.commentsService.create(createCommentInput, userId);
  }

  // Mutation to update an existing comment
  @Mutation(() => CommentResponse, { name: 'updateComment' })
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput, 
    @GetUserId() userId: number
  ): Promise<CommentResponse> {
    return this.commentsService.update(updateCommentInput, userId);
  }

  // Mutation to remove a comment
  @Mutation(() => CommentResponse, { name: 'removeComment' })
  async removeComment(@Args('commentId') commentId: number, @GetUserId() userId: number): Promise<CommentResponse> {
    return this.commentsService.remove(commentId, userId);
  }
}

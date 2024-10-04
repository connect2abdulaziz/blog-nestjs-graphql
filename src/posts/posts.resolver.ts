import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common'; 
import { PostsService } from 'src/posts/posts.service';
import { Post } from 'src/posts/entities/post.entity';
import { GetPostInput, CreatePostInput, UpdatePostInput } from 'src/posts/dto/posts.input.dto';
import { PostResponse, PaginatedPostResponse } from './dto/posts.response';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUserId } from 'src/decorators/get-user-id.decorator';
import { FilterInput } from 'src/common/pagenated.input';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => PaginatedPostResponse, { name: 'posts' })
  async getPosts(@Args('filter') filter: FilterInput): Promise<PaginatedPostResponse> {
    return this.postsService.findAll(filter);
  }

  @UseGuards(AuthGuard)
  @Query(() => PaginatedPostResponse, { name: 'userPosts' })
  async getUserPosts(@GetUserId() userId: number, @Args('filter') filter: FilterInput): Promise<PaginatedPostResponse> {
    return this.postsService.findAll(filter, userId); 
  }

  @Query(() => PostResponse, { name: 'post' })
  async getPost(@Args('getPostInput') getPostInput: GetPostInput): Promise<PostResponse> {
    return this.postsService.findOne(getPostInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PostResponse, { name: 'createPost' })
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput, 
    @GetUserId() userId: number
  ): Promise<PostResponse> {
    return this.postsService.create(createPostInput, userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PostResponse, { name: 'updatePost' })
  async updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput, 
    @GetUserId() userId: number
  ): Promise<PostResponse> {
    return this.postsService.update(updatePostInput, userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => PostResponse, { name: 'removePost' })
  async removePost(@Args('postId') postId: number, @GetUserId() userId: number): Promise<PostResponse> {
    return this.postsService.remove(postId, userId);
  }
}

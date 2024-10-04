import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';


@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}


}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PostResponse, PaginatedPostResponse} from './dto/posts.response';
import { ErrorMessages, StatusCode, SuccessMessages } from 'src/constants/messages.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { CreatePostInput, UpdatePostInput, GetPostInput } from './dto/posts.input.dto';
import { FilterInput } from'src/common/pagenated.input';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostInput: CreatePostInput, userId: number): Promise<PostResponse> {
    const post = this.postRepository.create({
      ...createPostInput,
      user: { id: userId }, 
    });

    const savedPost = await this.postRepository.save(post);
    const reloadedPost = await this.postRepository.findOne({ where: { id:savedPost.id }, relations: ['user', 'comments'] });
    return {
      statusCode: StatusCode.CREATED,
      message: SuccessMessages.POST_CREATED,
      data: reloadedPost,
    };
  }

  async findOne(getPostInput: GetPostInput): Promise<PostResponse> {
    const { id } = getPostInput;

    const post = await this.postRepository.findOne({ where: { id }, relations: ['user', 'comments'] });

    if (!post) {
      throw new NotFoundException(ErrorMessages.POST_NOT_FOUND);
    }

    return {
      statusCode: StatusCode.OK,
      message: SuccessMessages.POST_FOUND,
      data: post,
    };
  }

  async findAll(filter: FilterInput, userId?: number): Promise<PaginatedPostResponse> {
    const { page, limit, sortBy, sortOrder } = filter;
  
    const sortField = sortBy === 'title' ? 'post.title' : 'post.createdAt';
    const order = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  
    const queryBuilder = this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user') // Fetch user relation
      .leftJoinAndSelect('post.comments', 'comments'); // Fetch comments relation
  
    // If userId is provided, filter by user
    if (userId) {
      queryBuilder.where('post.user.id = :userId', { userId }); // Use the correct relation path
    }
  
    const [posts, totalCount] = await Promise.all([
      queryBuilder
        .skip((page - 1) * limit) // Pagination: Offset
        .take(limit) // Pagination: Limit
        .orderBy(sortField, order) // Apply sorting
        .getMany(), // Get the posts
      queryBuilder.getCount(), // Get total count of posts for pagination
    ]);
  
    const totalPages = Math.ceil(totalCount / limit);
  
    return {
      statusCode: StatusCode.OK,
      message: userId ? SuccessMessages.USER_POSTS_LIST_SUCCESS : SuccessMessages.POST_LIST_SUCCESS,
      data: posts,
      currentPage: page,
      pageSize: Math.min(totalCount, limit),
      totalPages,
      totalCount,
    };
  }
  

  async update(updatePostInput: UpdatePostInput, userId: number): Promise<PostResponse> {
    if (!updatePostInput) {
      throw new BadRequestException(ErrorMessages.POST_UPDATE_MISSING);
    }
    console.log(updatePostInput);
    const { id } = updatePostInput;
    console.log(id);
    // Ensure id is defined
    if (!id) {
      throw new BadRequestException(ErrorMessages.POST_ID_MISSING);
    }
  
    const post = await this.postRepository.findOne({ where: { id }, relations: ['user'] });

    
    if (!post) {
      throw new NotFoundException(ErrorMessages.POST_NOT_FOUND);
    }
    const {user} = post;
    console.log(user);
    if (post.user?.id !== userId) {
      throw new ForbiddenException(ErrorMessages.FORBIDDEN);
    }
  
    await this.postRepository.update(id, updatePostInput);
  
    const updatedPost = await this.postRepository.findOne({ where: { id }, relations: ['user', 'comments'] });
    console.log(updatedPost);
    return {
      statusCode: StatusCode.OK,
      message: SuccessMessages.POST_UPDATED,
      data: updatedPost,
    };
  }
  

  async remove(postId: number, userId: number): Promise<PostResponse> {
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException(ErrorMessages.POST_NOT_FOUND);
    }

    if (post.user.id !== userId) {
      throw new ForbiddenException(ErrorMessages.FORBIDDEN);
    }

    await this.postRepository.remove(post);

    return {
      statusCode: StatusCode.OK,
      message: SuccessMessages.POST_DELETED,
      data: null,
    };
  }
}

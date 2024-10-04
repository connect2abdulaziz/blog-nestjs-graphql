import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  CommentResponse,
  PaginatedCommentResponse,
} from './dto/comments.response';
import {
  ErrorMessages,
  StatusCode,
  SuccessMessages,
} from 'src/constants/messages.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import {
  CreateCommentInput,
  UpdateCommentInput,
  GetCommentInput,
} from './dto/comments.input.dto';
import { FilterInput } from 'src/common/pagenated.input';
import { PostsService } from'src/posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly postsService: PostsService
  ) {}

  async findAll(filter: FilterInput): Promise<PaginatedCommentResponse> {
    const { page, limit, sortBy, sortOrder } = filter;
  
    // Define valid sort fields
    const validSortFields = ['createdAt', 'updatedAt', 'content']; // Add any other fields you want to allow sorting by
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt'; // Fallback to default
  
    const order = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  
    const queryBuilder = this.commentRepository.createQueryBuilder('comments')
      .leftJoinAndSelect('comments.user', 'user');
  
    const [comments, totalCount] = await Promise.all([
      queryBuilder
        .skip((page - 1) * limit) // Pagination: Offset
        .take(limit) // Pagination: Limit
        .orderBy(`comments.${sortField}`, order) // Safely apply sorting with table alias
        .getMany(), // Get the comments
      queryBuilder.getCount(), // Get total count of comments for pagination
    ]);
  
    const totalPages = Math.ceil(totalCount / limit);
  
    return {
      statusCode: StatusCode.OK,
      message: SuccessMessages.COMMENT_LIST_SUCCESS,
      data: comments,
      currentPage: page,
      pageSize: Math.min(totalCount, limit),
      totalPages,
      totalCount,
    };
  }
  
  

  async findOne(getCommentInput: GetCommentInput): Promise<CommentResponse> {
    const { id } = getCommentInput;

    // Find the comment by ID
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'], // Use an array for relations
    });
    

    if (!comment) {
      throw new NotFoundException(ErrorMessages.COMMENT_NOT_FOUND);
    }

    return {
      statusCode: StatusCode.OK,
      message: SuccessMessages.COMMENT_FOUND,
      data: comment,
    };
  }

  async create(
    createCommentInput: CreateCommentInput,
    userId: number,
  ): Promise<CommentResponse> {
    const { postId } = createCommentInput;
  
    // Check if the post exists
    const post = await this.postsService.findOne({id: postId});
    if (!post) {
      return {
        statusCode: StatusCode.NOT_FOUND,
        message: ErrorMessages.POST_NOT_FOUND,
        data: null,
      };
    }
  
    const comment = this.commentRepository.create({
      ...createCommentInput,
      user: { id: userId }, 
    });
  
    const savedComment = await this.commentRepository.save(comment);
  
    return {
      statusCode: StatusCode.CREATED,
      message: SuccessMessages.COMMENT_CREATED,
      data: savedComment,
    };
  }
  

  async update(
    updateCommentInput: UpdateCommentInput,
    userId: number,
  ): Promise<CommentResponse> {
    const { id } = updateCommentInput;

    // Find the comment by ID
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException(ErrorMessages.COMMENT_NOT_FOUND);
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException(ErrorMessages.UNAUTHORIZED_ACTION);
    }

    await this.commentRepository.update(id, updateCommentInput);
    const updatedComment = await this.commentRepository.findOne({
      where: { id },
    });

    return {
      statusCode: StatusCode.OK,
      message: SuccessMessages.COMMENT_UPDATED,
      data: updatedComment,
    };
  }

  async remove(id: number, userId: number): Promise<CommentResponse> {
    // Find the comment by ID
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException(ErrorMessages.COMMENT_NOT_FOUND);
    }

    if (comment.user.id !== userId) {
      throw new ForbiddenException(ErrorMessages.UNAUTHORIZED_ACTION);
    }

    await this.commentRepository.remove(comment);

    return {
      statusCode: StatusCode.OK,
      message: SuccessMessages.COMMENT_DELETED,
      data: null,
    };
  }
}

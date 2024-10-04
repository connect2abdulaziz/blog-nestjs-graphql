import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommentResponse, PaginatedCommentResponse } from './dto/comments.response';
import {
  ErrorMessages,
  StatusCode,
  SuccessMessages,
} from 'src/constants/messages.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import { CreateCommentInput, UpdateCommentInput, GetCommentInput } from './dto/comments.input.dto';
import { FilterInput } from 'src/common/pagenated.input';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAll(filter: FilterInput): Promise<PaginatedCommentResponse> {
    const { page, limit, sortBy, sortOrder } = filter;

    const sortField = sortBy ? sortBy : 'createdAt';
    const order = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user') // Join with user
      .skip((page - 1) * limit) // Pagination: Offset
      .take(limit) // Pagination: Limit
      .select([
        'comment.id',
        'comment.content',
        'comment.createdAt',
        'comment.updatedAt',
        'user.id',
        'user.firstName',
        'user.lastName',
      ]); // Select fields

    // Apply sorting
    queryBuilder.orderBy(sortField, order);

    // Execute the queries: one for the comment data and another for the total count
    const [comments, totalCount] = await Promise.all([
      queryBuilder.getMany(), // Get the paginated comments
      this.commentRepository.count(), // Count all comments for pagination
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
    const comment = await this.commentRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException(ErrorMessages.COMMENT_NOT_FOUND);
    }

    return {
      statusCode: StatusCode.OK,
      message: SuccessMessages.COMMENT_FOUND,
      data: comment,
    };
  }

  async create(createCommentInput: CreateCommentInput, userId: number): Promise<CommentResponse> {
    const comment = this.commentRepository.create({
      ...createCommentInput,
      user: { id: userId }, // Associate the comment with the user
    });

    const savedComment = await this.commentRepository.save(comment);

    return {
      statusCode: StatusCode.CREATED,
      message: SuccessMessages.COMMENT_CREATED,
      data: savedComment,
    };
  }

  async update(updateCommentInput: UpdateCommentInput, userId: number): Promise<CommentResponse> {
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
    const updatedComment = await this.commentRepository.findOne({ where: { id } });

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

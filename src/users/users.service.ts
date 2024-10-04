import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PaginatedUserResponse, UserResponse } from './dto/users.response';
import {
  ErrorMessages,
  StatusCode,
  SuccessMessages,
} from 'src/constants/messages.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { GetUserInput, UpdateUserInput } from './dto/users.input.dto';
import { FilterInput } from 'src/common/pagenated.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(filter: FilterInput): Promise<PaginatedUserResponse> {
    const { page, limit, sortBy, sortOrder } = filter;

    const sortField = sortBy === 'posts' ? 'posts.title' : 'user.firstName';
    const order = sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    console.log('Fetching users...');

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.posts', 'posts') // Join with posts
      .skip((page - 1) * limit) // Pagination: Offset
      .take(limit) // Pagination: Limit
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.profileImage',
        'user.createdAt',
        'user.updatedAt',
        'posts.id', // Select post fields
        'posts.title',
      ]); // Explicitly select all fields

    // Apply sorting
    queryBuilder.orderBy(sortField, order);

    // Execute the queries: one for the user data and another for the total count
    const [users, totalCount] = await Promise.all([
      queryBuilder.getMany(), // Get the paginated users
      this.userRepository.count(), // Count all users for pagination purposes
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      statusCode: StatusCode.OK,
      message: SuccessMessages.USER_LIST_SUCCESS,
      data: users,
      currentPage: page,
      pageSize: Math.min(totalCount, limit),
      totalPages,
      totalCount,
    };
  }

  async findOne(getUserInput: GetUserInput): Promise<UserResponse> {
    const { id, includePosts, includeComments } = getUserInput || {
      id: getUserInput.id,
      includePosts: false,
      includeComments: false,
    };

    // Find the user by ID
    const relations = [];
    if (includePosts) {
      relations.push('posts');
    }
    if (includeComments) {
      relations.push('comments');
    }

    const user = await this.userRepository.findOne({
      where: { id },
      relations, // Use the constructed relations array
    });

    if (!user) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }

    // Clean the user data by excluding sensitive information like password
    const { password, ...cleanedUser } = user;

    // Include posts and comments in the response if applicable
    const responseUser = {
      ...cleanedUser,
      // posts: includePosts ? posts : undefined,
      // comments: includeComments ? comments : undefined,
    };

    // Return the response in the proper format
    return {
      statusCode: StatusCode.OK,
      message: SuccessMessages.USER_FOUND,
      data: responseUser,
    };
  }

  async update(
    updateUserInput: UpdateUserInput,
    id: number,
  ): Promise<UserResponse> {
    // Find the user by ID
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND); // Update error message
    }

    // Update the user's details
    await this.userRepository.update(id, updateUserInput); // Use id and updateUserInput

    // Fetch the updated user
    const updatedUser = await this.userRepository.findOne({ where: { id } });

    // Clean the user object to exclude sensitive information
    const { password, ...cleanedUser } = updatedUser;

    return {
      statusCode: StatusCode.OK,
      message: SuccessMessages.USER_UPDATED,
      data: cleanedUser,
    };
  }

  async remove(id: number): Promise<UserResponse> {
    // Find the user by ID
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }

    // Remove the user
    await this.userRepository.remove(user);

    // Return a structured response indicating success
    return {
      statusCode: StatusCode.OK,
      message: SuccessMessages.USER_DELETED, // Ensure you have this constant defined
      data: null,
    };
  }

  // async uploadProfileImage(
  //   userId: number,
  //   file: Express.Multer.File,

  // ): Promise<UserResponse> {
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //   });

  //   if (!user) {
  //     throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
  //   }

  //   try {
  //     // Use FileUploadService to upload file and get the file key
  //     const fileKey = await this.fileUploadService.uploadFile(file);
  //     // Get signed URL
  //     const signedUrl = await this.fileUploadService.getSignedUrlS(fileKey);
  //     user.profileImage= signedUrl;
  //     await this.userRepository.save(user);
  //     return {
  //       statusCode: StatusCode.OK,
  //       message: SuccessMessages.USER_UPDATED_PROFILE_IMAGE,
  //       data: user,
  //     }
  //   } catch (error) {
  //     throw new InternalServerErrorException('Error uploading profile picture');
  //   }
  // }
}

import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common'; 
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { GetUserInput, UpdateUserInput } from 'src/users/dto/users.input.dto';
import { FilterInput } from 'src/common/pagenated.input';
import { UserResponse, PaginatedUserResponse } from './dto/users.response';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUserId } from 'src/decorators/get-user-id.decorator';
//import { Upload } from 'graphql-upload'

@UseGuards(AuthGuard) 
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => UserResponse, { name: 'user' })
  async getUser(@Args('getUserInput') getUserInput: GetUserInput): Promise<UserResponse> {
    return this.usersService.findOne(getUserInput);
  }

  @Query(() => PaginatedUserResponse, { name: 'users' })
  async getUsers(@Args('filter') filter: FilterInput): Promise<PaginatedUserResponse> {
    return this.usersService.findAll(filter);
  }

  @Query(() => UserResponse, { name: 'currentUser' })
  async getCurrentUser(@GetUserId() userId: number): Promise<UserResponse> {
    return this.usersService.findOne({ id: userId });
  }

  @Mutation(() => UserResponse, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput, 
    @GetUserId() userId: number
  ): Promise<UserResponse> {
    return this.usersService.update(updateUserInput, userId);
  }

  @Mutation(() => UserResponse, { name: 'removeUser' })
  async removeUser(@GetUserId() userId: number): Promise<UserResponse> {
    return this.usersService.remove(userId);
  }

 
  // @Mutation(() => UserResponse, { name: 'uploadProfileImage' })
  // async uploadProfileImage(
  //   @Args('userId') userId: number,
  //   @Args({ name: 'file', type: () => Upload }) file: Express.Multer.File,
  // ): Promise<UserResponse> {
  //   return this.usersService.uploadProfileImage(userId, file);
  // }
}

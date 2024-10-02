import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { ApiResponse } from './dto/api-response.dto';
import { User } from'src/users/entities/user.entity';

// Assuming you have a Boolean return type, or you could create custom types for return types.
@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => ApiResponse) 
  async signup(
    @Args('signupInput') signupInput: SignupInput,
  ){
    return await this.authService.signup(signupInput);
  }

  @Mutation(() => ApiResponse)
  async login(@Args('loginInput') loginInput: LoginInput){
    return await this.authService.login(loginInput);
  }
  

  @Mutation(() => ApiResponse) 
  async verifyEmail(@Args('token') token: string){
    return await this.authService.verifyEmail(token);
  }


  @Mutation(() => ApiResponse)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput,
  ) {
    return await this.authService.forgotPassword(forgotPasswordInput);
  }

  @Mutation(() => ApiResponse) 
  async resetPassword(
    @Args('token') token: string,
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ) {
    return await this.authService.resetPassword(token, resetPasswordInput);
  }

  @Query(() => Boolean) 
  async signout(){
    // logic for signing out
    return true;
  }
}

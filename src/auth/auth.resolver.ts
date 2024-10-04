import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, SignupInput, ForgotPasswordInput, ResetPasswordInput} from './dto/auth.input.dto';
import { AuthResponse } from './dto/auth.response.dto';
import { User } from 'src/users/entities/user.entity';

// Assuming you have a Boolean return type, or you could create custom types for return types.
@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async signup(@Args('signupInput') signupInput: SignupInput) {
    return await this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return await this.authService.login(loginInput);
  }

  @Mutation(() => AuthResponse)
  async verifyEmail(@Args('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @Mutation(() => AuthResponse)
  async forgotPassword(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput,
  ) {
    return await this.authService.forgotPassword(forgotPasswordInput);
  }

  @Mutation(() => AuthResponse)
  async resetPassword(
    @Args('token') token: string,
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ) {
    return await this.authService.resetPassword(token, resetPasswordInput);
  }

  @Query(() => Boolean)
  async signout() {
    // logic for signing out
    return true;
  }
}

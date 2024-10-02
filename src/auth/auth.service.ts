import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { EmailService } from 'src/integrations/sg/email.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as sgMail from '@sendgrid/mail';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ApiResponse, LoginResponse } from './dto/api-response.dto';
import { ErrorMessages } from 'src/constants/messages.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    sgMail.setApiKey(
      this.configService.get<string>('SENDGRID_API_KEY') || 'your Key',
    );
  }

  async signup(signupInput: SignupInput): Promise<ApiResponse<Boolean>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: signupInput.email },
    });

    if (existingUser) {
      throw new ConflictException(ErrorMessages.EMAIL_ALREADY_EXISTS);
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = this.userRepository.create({
      ...signupInput,
      isVerified: false,
      verificationToken,
    });

    await this.emailService.sendVerificationEmail(
      signupInput.email,
      verificationToken,
    );
    await this.userRepository.save(user);

    return {
      status: 'success',
      message: 'User registered successfully. Please verify your email.',
      data: true
    };
  }

  async verifyEmail(token: string): Promise<ApiResponse<Boolean>> {
    const user = await this.userRepository.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException(ErrorMessages.INVALID_VERIFICATION_TOKEN);
    }

    if (user.isVerified) {
      throw new BadRequestException(ErrorMessages.USER_ALREADY_VERIFIED);
    }

    user.isVerified = true;
    user.verificationToken = '';
    await this.userRepository.save(user);

    return {
      status: 'success',
      message: 'Email verified successfully.',
      data: true,
    };
  }

  async login(loginInput: LoginInput): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({
      where: { email: loginInput.email },
    });
    console.log(user);

    if (!user || (await bcrypt.compare(loginInput.password, user?.password))) {
      throw new UnauthorizedException(ErrorMessages.INVALID_CREDENTIALS);
    }

    if (!user.isVerified) {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.verificationToken,
      );

      throw new UnauthorizedException(ErrorMessages.EMAIL_NOT_VERIFIED);
    }

    const payload = {
      sub: user.id.toString(),
      username: `${user.firstName} ${user.lastName}`,
    };
    console.log(payload);
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload);

    console.log(accessToken, refreshToken);
    return {
      id: user.id,
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(
    forgotPasswordInput: ForgotPasswordInput,
  ): Promise<ApiResponse<Boolean>> {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordInput.email },
    });

    if (!user) {
      throw new BadRequestException(ErrorMessages.EMAIL_NOT_FOUND);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = resetToken;
    await this.userRepository.save(user);

    await this.emailService.sendResetEmail(
      forgotPasswordInput.email,
      resetToken,
    );

    return {
      status: 'success',
      message: 'Password reset email sent.',
      data: true,
    };
  }

  async resetPassword(
    token: string,
    resetPasswordInput: ResetPasswordInput,
  ): Promise<ApiResponse<Boolean>> {
    const user = await this.userRepository.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException(ErrorMessages.INVALID_TOKEN);
    }

    user.password = await bcrypt.hash(resetPasswordInput.newPassword, 10);
    user.verificationToken = '';
    await this.userRepository.save(user);

    return {
      status: 'success',
      message: 'Password reset successful.',
      data: true
    };
  }
}

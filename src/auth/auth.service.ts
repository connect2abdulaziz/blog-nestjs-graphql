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
import { ApiResponse, LoginData } from './dto/api-response.dto';
import {
  ErrorMessages,
  SuccessMessages,
  StatusCode,
} from 'src/constants/messages.constants';

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

  async signup(signupInput: SignupInput): Promise<ApiResponse> {
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
      statusCode: StatusCode.CREATED, 
      message: SuccessMessages.USER_REGISTERED_SUCCESS,
    };
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
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
      statusCode: StatusCode.OK, // Status code for successful operation
      message: SuccessMessages.EMAIL_VERIFIED_SUCCESS,
    };
  }

  async login(loginInput: LoginInput): Promise<ApiResponse> {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: loginInput.email },
    });

    if (!user || !(await bcrypt.compare(loginInput.password, user.password))) {
      throw new UnauthorizedException(ErrorMessages.INVALID_EMAIL_OR_PASSWORD);
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.verificationToken,
      );
      throw new UnauthorizedException(ErrorMessages.EMAIL_NOT_VERIFIED);
    }

    // Create the payload for the JWT
    const payload = {
      sub: user.id.toString(),
      username: `${user.firstName} ${user.lastName}`,
    };

    // Generate access and refresh tokens
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<number>('JWT_REFRESH_EXPIRES_IN'),
    });
    

    const responseData: LoginData = {
      id: user.id,
      accessToken,
      refreshToken,
    };

    return {
      statusCode: StatusCode.OK, // Status code for successful operation
      message: SuccessMessages.LOGIN_SUCCESS,
      data: responseData
    };
  }

  async forgotPassword(
    forgotPasswordInput: ForgotPasswordInput,
  ): Promise<ApiResponse> {
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
      statusCode: StatusCode.OK, // Status code for successful operation
      message: SuccessMessages.PASSWORD_RESET_EMAIL_SENT,
    };
  }

  async resetPassword(
    token: string,
    resetPasswordInput: ResetPasswordInput,
  ): Promise<ApiResponse> {
    const user = await this.userRepository.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      throw new BadRequestException(ErrorMessages.INVALID_TOKEN);
    }

    user.password = resetPasswordInput.newPassword;
    user.verificationToken = '';
    await this.userRepository.save(user);

    return {
      statusCode: StatusCode.OK, 
      message: SuccessMessages.PASSWORD_RESET_SUCCESS,
    };
  }
}

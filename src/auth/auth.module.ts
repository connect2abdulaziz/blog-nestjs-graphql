import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { EmailModule } from 'src/integrations/sg/email.module';
import { EmailService } from'src/integrations/sg/email.service';
import { UsersService } from'src/users/users.service';

@Module({
  imports: [
    // Import the TypeORM module with the User entity
    TypeOrmModule.forFeature([User]),

    // Import UsersModule and EmailModule (for injecting UserService and EmailService)
    UsersModule,
    EmailModule,

    // Register JwtModule asynchronously with dynamic configuration from ConfigService
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    }),
  ],

  // Provide AuthService only; UsersService and EmailService are already provided by their modules
  providers: [AuthService, AuthResolver, UsersService, EmailService],
  // Export AuthService for use in other modules
  exports: [AuthService],
})
export class AuthModule {}

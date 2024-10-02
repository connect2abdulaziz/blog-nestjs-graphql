import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/config/database/data-source';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from 'src/config/app/config.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      //typePaths: ['./**/*.graphql'],
    }),

    // Global configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeORM module with database options
    TypeOrmModule.forRoot(dataSourceOptions),

    // Application-specific modules
    AppConfigModule,
    AuthModule,
    JwtModule,
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
  //providers: [UsersResolver, UsersService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

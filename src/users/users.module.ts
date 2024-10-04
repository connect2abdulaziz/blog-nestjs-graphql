import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { PostsService } from 'src/posts/posts.service';
import { CommentsService } from 'src/comments/comments.service';
import { UserResolver } from './users.resolver';
import { Post } from'src/posts/entities/post.entity';
import { Comment } from'src/comments/entities/comment.entity';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsModule } from'src/comments/comments.module';
import { FileUploadModule } from'src/integrations/s3/file-upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Comment]), // Make sure User is imported here
    PostsModule,
    CommentsModule,
    FileUploadModule,
  ],
  providers: [UsersService, UserResolver, PostsService, CommentsService],
  // providers: [UsersService, PostsService, CommentsService],
  exports: [UsersService], // Optional: if you need to use UsersService in other modules
})
export class UsersModule {}

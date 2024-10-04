import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentResolver } from './comments.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentResolver, CommentsService],
})
export class CommentsModule {}

import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity({ name: 'comments' })
@ObjectType()
export class Comment extends BaseEntity {
  @Column()
  @Field()
  content: string;

  @ManyToOne(() => Post, (post) => post.comments, { cascade: true })
  @JoinColumn({ name: 'post_id' })
  @Field(() => Post) // Explicitly specify the type
  post: Post;

  @ManyToOne(() => User, (user) => user.comments, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  @Field(() => User) // Explicitly specify the type
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.replies, { cascade: true })
  @JoinColumn({ name: 'parent_id' })
  @Field(() => Comment, { nullable: true }) // Explicitly specify the type and allow null
  parent?: Comment; // Made optional

  @OneToMany(() => Comment, (comment) => comment.parent)
  @Field(() => [Comment]) // Explicitly specify the type
  replies: Comment[];
}

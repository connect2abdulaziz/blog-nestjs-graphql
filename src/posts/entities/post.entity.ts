import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity({ name: 'posts' })
@ObjectType()
export class Post extends BaseEntity {
  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  content: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  thumbnail: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  coverImage: string;

  @Column()
  @Field()
  tag: string;

  @ManyToOne(() => User, (user) => user.posts, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  @JoinColumn()
  @Field(() => [Comment])
  comments: Comment[];
}

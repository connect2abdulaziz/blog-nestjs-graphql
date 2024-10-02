import { ObjectType, Field } from "@nestjs/graphql";
import { Entity, Column, OneToMany } from 'typeorm';
import { Comment } from 'src/comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { BaseEntity } from "src/common/base.entity";

@Entity({name: 'users'})
@ObjectType()
export class User extends BaseEntity {

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @OneToMany(() => Post, (post) => post.user)
  @Field(() => [Post])
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  @Field(() => [Comment])
  comments: Comment[];

  @Column({unique: true})
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ default: false })
  @Field({defaultValue: false})
  isVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable : true})
  verificationToken: string;


  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable : true})
  profileImage: string


  @Column({ type: 'varchar', nullable: true })
  @Field({ nullable : true})
  thumbnail: string;

}

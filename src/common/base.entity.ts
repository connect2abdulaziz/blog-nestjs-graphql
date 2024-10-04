import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';


// Base entity for all entities in the application.
@ObjectType()
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @UpdateDateColumn()
  @Field({ defaultValue: 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @CreateDateColumn()
  @Field({ defaultValue: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
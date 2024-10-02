import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int } from '@nestjs/graphql';

// Base entity for all entities in the application.
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
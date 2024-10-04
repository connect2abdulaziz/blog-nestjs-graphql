import {
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

// Base entity for all entities in the application.
@ObjectType()
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ name: 'createdAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) 
  @Field(() => Date)
  createdAt: Date;

  @Column({ name: 'updatedAt', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }) 
  @Field(() => Date)
  updatedAt: Date;
}

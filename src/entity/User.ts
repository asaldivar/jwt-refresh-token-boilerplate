import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Field()
  @Column('text')
  email: string

  @Column('text')
  password: string

  @Field()
  @Column('int', { default: 0 })
  count: number
}

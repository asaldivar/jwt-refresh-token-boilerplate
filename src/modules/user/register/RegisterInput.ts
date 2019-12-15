import { InputType, Field } from 'type-graphql'
import { IsEmail } from 'class-validator'
import { IsEmailAlreadyExist } from './isEmailAlreadyExists'

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: 'email already in use' })
  email: string

  @Field()
  password: string
}

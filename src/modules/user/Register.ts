import { Resolver, Query, Arg, Mutation } from 'type-graphql'
import bcrypt from 'bcryptjs'

import { User } from '../../entity/User'
import { RegisterInput } from './register/RegisterInput'

@Resolver(User)
export class RegisterResolver {
  @Query(() => String)
  me(): string {
    return 'harrow'
  }

  @Mutation(() => User)
  async register(
    @Arg('data') { email, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      email,
      password: hashedPassword,
    }).save()

    return user
  }
}

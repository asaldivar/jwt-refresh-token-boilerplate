import { Resolver, Arg, Mutation, Ctx } from 'type-graphql'
import bcrypt from 'bcryptjs'

import { User } from '../../entity/User'
import { Context } from '../../types/Context'
import { createTokens } from '../../utils/auth'

@Resolver(User)
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: Context
  ): Promise<User | null> {
    const user = await User.findOne({ email })
    if (!user) return null

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return null

    const { accessToken, refreshToken } = createTokens(user)

    ctx.res.cookie('access-token', accessToken, {
      expires: new Date(Date.now() + 60 * 15 * 1000), // 15 minutes
    })
    ctx.res.cookie('refresh-token', refreshToken, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days
    })

    return user
  }
}

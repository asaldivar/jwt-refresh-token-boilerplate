import { Resolver, Ctx, Mutation } from 'type-graphql'
import { User } from '../../entity/User'
// import { Context } from '../../types/Context'

@Resolver(User)
export class InvalidateTokensResolver {
  @Mutation(() => Boolean)
  async invalidateTokens(@Ctx() ctx: any): Promise<Boolean> {
    if (!ctx.req.userId) return false

    const user = await User.findOne(ctx.req.userId)

    if (!user) return false

    user.count += 1
    await user.save()
    console.log('invalidated')
    return true
  }
}

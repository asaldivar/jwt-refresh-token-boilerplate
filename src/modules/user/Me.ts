import { Ctx, Resolver, Query } from 'type-graphql'
import { User } from '../../entity/User'

@Resolver(User)
export class MeResolver {
  @Query(() => User)
  async me(@Ctx() ctx: any): Promise<User | null | undefined> {
    if (!ctx.req.userId) return null

    const user = await User.findOne(ctx.req.userId)
    console.log(user)
    return user
  }
}

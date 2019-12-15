import { IResolvers } from 'graphql-tools'
import * as bcrypt from 'bcryptjs'

import { User } from './entity/User'
import { createTokens } from './utils/auth'

export const resolvers: IResolvers = {
  Query: {
    me: (_, __, { req }) => {
      if (!req.userId) return null

      return User.findOne(req.userId)
    },
  },
  Mutation: {
    register: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10)
      await User.create({
        email,
        password: hashedPassword,
      }).save()

      return true
    },
    login: async (_, { email, password }, { res }) => {
      const user = await User.findOne({ email })
      if (!user) return null

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) return null

      const { accessToken, refreshToken } = createTokens(user)

      res.cookie('access-token', accessToken, {
        expires: new Date(Date.now() + 60 * 15 * 1000), // 15 minutes
      })
      res.cookie('refresh-token', refreshToken, {
        expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days
      })

      return user
    },
    invalidateTokens: async (_, __, { req }) => {
      if (!req.userId) return false

      const user = await User.findOne(req.userId)

      if (!user) return false

      user.count += 1
      await user.save()

      return true
    },
  },
}

import 'reflect-metadata'
import { createConnection } from 'typeorm'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import cookieParser from 'cookie-parser'
import { buildSchema } from 'type-graphql'

// import { typeDefs } from './typeDefs'
// import { resolvers } from './resolvers'
import { verify } from 'jsonwebtoken'
import { User } from './entity/User'
import { createTokens } from './utils/auth'
import { RegisterResolver } from './modules/user/Register'
import { LoginResolver } from './modules/user/Login'
import { InvalidateTokensResolver } from './modules/user/InvalidateTokens'
import { MeResolver } from './modules/user/Me'

const startServer = async () => {
  await createConnection()

  const schema = await buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      InvalidateTokensResolver,
      MeResolver,
    ],
  })

  const server = new ApolloServer({
    schema,
    // typeDefs,
    // resolvers,
    context: ({ req, res }) => ({ req, res }),
  })

  const app = express()

  app.use(cookieParser())

  app.use(async (req: any, res, next) => {
    const accessToken = req.cookies['access-token']
    const refreshToken = req.cookies['refresh-token']

    if (!refreshToken && !accessToken) return next()

    try {
      const data = verify(accessToken, 'environmentvariable') as any
      req.userId = data.userId

      return next()
    } catch {}

    if (!refreshToken) return next()

    let data

    try {
      data = verify(refreshToken, 'environmentvariable') as any
    } catch {
      return next()
    }

    const user = await User.findOne(data.userId)
    // token has been invalidated
    if (!user || user.count !== data.count) {
      return next()
    }

    const tokens = createTokens(user)
    console.log('create new tokens')
    res.cookie('refresh-token', tokens.refreshToken)
    res.cookie('access-token', tokens.accessToken)
    console.log('here')
    req.userId = user.id

    return next()
  })

  server.applyMiddleware({ app })

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  )
}

startServer()

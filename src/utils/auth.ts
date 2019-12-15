import { User } from '../entity/User'
import { sign } from 'jsonwebtoken'

export const createTokens = (user: User) => {
  const accessToken = sign({ userId: user.id }, 'environmentvariable', {
    expiresIn: '15min',
  })
  const refreshToken = sign(
    { userId: user.id, count: user.count },
    'environmentvariable',
    {
      expiresIn: '7d',
    }
  )

  return { accessToken, refreshToken }
}

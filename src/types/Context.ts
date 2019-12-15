import { Request, Response } from 'express'

interface Test extends Request {
  userId: string
}

export interface Context {
  req: Test
  res: Response
}

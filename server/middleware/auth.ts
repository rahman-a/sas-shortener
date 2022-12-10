import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { getUser } from '../controllers/crud.js'

type Token = {
  _id: string
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.cookies['token']) {
      const token = req.cookies['token']
      const decode = jwt.verify(token, process.env.JWT_SECRET!) as Token
      if (!decode) {
        res.status(401)
        throw new Error('please login first')
      }
      const user = await getUser({ _id: decode._id })
      if (!user) {
        res.status(401)
        throw new Error('please login first')
      }
      next()
    } else {
      res.status(401)
      throw new Error('please login first')
    }
  } catch (error) {
    next(error)
  }
}

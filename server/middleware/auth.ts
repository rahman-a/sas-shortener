import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/users.js'
import { checkRoleCode } from '../util/utils.js'
type Token = {
  _id: string
}

export const isAuthenticated = async (
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
      const user = await User.findById(decode._id)
      if (!user) {
        res.status(401)
        throw new Error('please login first')
      }
      req.user = user
      req.token = token
      next()
    } else {
      res.status(401)
      throw new Error('please login first')
    }
  } catch (error) {
    next(error)
  }
}

export const isAuthorized =
  (role: string) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = req.user.roles
      const hasRole = checkRoleCode(roles, role)
      if (!hasRole) {
        res.status(401)
        throw new Error('You are not authorized to perform this action')
      }
      next()
    } catch (error) {
      next(error)
    }
  }

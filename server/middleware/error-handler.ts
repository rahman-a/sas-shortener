import { Request, Response, NextFunction } from 'express'
export const notFound = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new Error(`${req.originalUrl} not found`)
  res.status(404)
  next(error)
}

export const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = null
  for (let key in err.errors) {
    error = `${err.errors[key].value} is invalid please write a valid ${err.errors[key].path}`
  }
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let errorObject = {}
  if (process.env.NODE_ENV === 'development') {
    errorObject = {
      success: false,
      message: error ? error : err.message,
      error: statusCode,
      stack: err.stack,
    }
  } else {
    errorObject = {
      success: false,
      message: error ? error : err.message,
      error: statusCode,
    }
  }
  res.status(statusCode).send(errorObject)
}

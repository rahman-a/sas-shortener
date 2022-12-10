import express, { Express, Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { nanoid } from 'nanoid'
import cors from 'cors'
import path from 'path'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/error-handler.js'
import { isAuth } from './middleware/auth.js'
import {
  shortenUrl,
  updateUrlClicks,
  getAllUrls,
  getOneUrl,
  deleteUrl,
  filterUrls,
  getUser,
} from './controllers/crud.js'
import { validateUrl, validateEmail, expireAt } from './util/utils.js'

dotenv.config()

const app: Express = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)

app.use(morgan('dev'))

// serve static files
app.use(
  '/api/assets',
  express.static(path.join(process.cwd(), 'server', 'assets'))
)

// authentication
app.post(
  '/api/login',
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    try {
      if (!email || !password) {
        throw new Error('Please enter your email and password')
      }
      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email')
      }
      const user = await getUser({ email })
      if (!user) {
        throw new Error('Invalid credentials')
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        throw new Error('Invalid credentials')
      }
      const token = jsonwebtoken.sign(
        { _id: user._id },
        process.env.JWT_SECRET!,
        {
          expiresIn: '1d',
        }
      )
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      })
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          expireAt: expireAt(1),
        },
      })
    } catch (error) {
      console.log('error: ', error)
      next(error)
    }
  }
)

// Authorization middleware
app.use(isAuth)

// shorten a new url
app.post(
  '/api/shorten',
  async (req: Request, res: Response, next: NextFunction) => {
    const { destination } = req.body
    try {
      if (!destination) {
        throw new Error('Please enter a url to shorten')
      }
      if (!validateUrl(destination)) {
        throw new Error('Please enter a valid url')
      }
      const isUrlFound = await getOneUrl({ destination })
      if (isUrlFound) {
        throw new Error('URL already found, please choose another url')
      }
      const newUrl = {
        destination,
        short: nanoid(7),
        clicks: 0,
      }
      await shortenUrl(newUrl)
      res.status(201).json({
        success: true,
        url: newUrl,
      })
    } catch (error) {
      next(error)
    }
  }
)

// get all urls
app.get(
  '/api/urls',
  async (req: Request, res: Response, next: NextFunction) => {
    const { createdAt, clicks, page } = req.query
    let sort: any = {}
    if (createdAt) sort['createdAt'] = createdAt
    if (clicks) sort['clicks'] = clicks
    if (page) sort['page'] = Number(page)

    try {
      const urls = await getAllUrls({ ...sort })
      res.status(200).json({
        success: true,
        urls,
      })
    } catch (error) {
      next(error)
    }
  }
)

// filter urls based on query
app.get(
  '/api/urls/filter',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const urls = await filterUrls(req.query)
      res.status(200).json({
        success: true,
        urls,
      })
    } catch (error) {
      next(error)
    }
  }
)
// delete a url
app.delete(
  '/api/:short',
  async (req: Request, res: Response, next: NextFunction) => {
    const { short } = req.params
    try {
      const url = await deleteUrl(short)
      if (!url) {
        throw new Error('No url found')
      }
      res.status(200).json({
        success: true,
        url,
      })
    } catch (error) {
      next(error)
    }
  }
)

// redirect to the destination url
app.get('/:short', async (req: Request, res: Response) => {
  const { short } = req.params
  const url = await getOneUrl({ short })
  if (!url) {
    res.sendFile(path.join(process.cwd(), 'server', 'views', '404.html'))
    return
  } else {
    await updateUrlClicks(short)
    res.redirect(url.destination!)
  }
})

// logout
app.post('/api/logout', (req: Request, res: Response) => {
  res.clearCookie('token')
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
})
app.use(notFound)
app.use(errorHandler)
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

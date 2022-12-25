import express, { Express } from 'express'
import fs from 'fs'
import path from 'path'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import fileUpload from 'express-fileupload'
import { notFound, errorHandler } from './middleware/error-handler.js'
import UrlsRouter from './routers/urls.js'
import userRouters from './routers/users.js'
import contactRouter from './routers/contacts.js'
import jobsRouter from './routers/jobs.js'
import applicantsRouter from './routers/applications.js'
import { requestShortUrl } from './controllers/urls.js'

dotenv.config()

const app: Express = express()

export const logStream = fs.createWriteStream(
  path.join(process.cwd(), 'server/logs/access.log'),
  { flags: 'a' }
)

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: ['http://localhost:8000', 'http://localhost:3000'],
    credentials: true,
  })
)
app.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  })
)

app.use(morgan('dev'))

app.use(morgan('combined', { stream: logStream }))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'client', 'dist')))
  app.get('/', (req, res) => {
    res
      .status(200)
      .sendFile(path.join(process.cwd(), 'client', 'dist', 'index.html'))
  })
}

// serve static files
app.use(
  '/api/assets',
  express.static(path.join(process.cwd(), 'server', 'assets'))
)

app.use(
  '/api/resumes',
  express.static(path.join(process.cwd(), 'server', 'uploads/resumes'))
)

// initialize routes
app.use('/api/v1/urls', UrlsRouter)
app.use('/api/v1/users', userRouters)
app.use('/api/v1/contacts', contactRouter)
app.use('/api/v1/jobs', jobsRouter)
app.use('/api/v1/applications', applicantsRouter)
app.use('/:short', requestShortUrl)

app.use(notFound)
app.use(errorHandler)
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI!

mongoose.set('strictQuery', true)
mongoose
  .connect(MONGO_URI)
  .then((connect) => {
    console.log('Connected to MongoDB', connect.connection.host)
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB', err.message)
  })

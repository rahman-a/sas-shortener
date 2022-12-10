var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1]
          return t[1]
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this
        }),
      g
    )
    function verb(n) {
      return function (v) {
        return step([n, v])
      }
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.')
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t
          if (((y = 0), t)) op = [op[0] & 2, t.value]
          switch (op[0]) {
            case 0:
            case 1:
              t = op
              break
            case 4:
              _.label++
              return { value: op[1], done: false }
            case 5:
              _.label++
              y = op[1]
              op = [0]
              continue
            case 7:
              op = _.ops.pop()
              _.trys.pop()
              continue
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0
                continue
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1]
                break
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1]
                t = op
                break
              }
              if (t && _.label < t[2]) {
                _.label = t[2]
                _.ops.push(op)
                break
              }
              if (t[2]) _.ops.pop()
              _.trys.pop()
              continue
          }
          op = body.call(thisArg, _)
        } catch (e) {
          op = [6, e]
          y = 0
        } finally {
          f = t = 0
        }
      if (op[0] & 5) throw op[1]
      return { value: op[0] ? op[1] : void 0, done: true }
    }
  }
import express from 'express'
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
var app = express()
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use(morgan('dev'))
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'client', 'dist')))
  app.get('/', function (req, res) {
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
// authentication
app.post('/api/login', function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch, token, error_1
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ;(_a = req.body), (email = _a.email), (password = _a.password)
          _b.label = 1
        case 1:
          _b.trys.push([1, 4, , 5])
          if (!email || !password) {
            throw new Error('Please enter your email and password')
          }
          if (!validateEmail(email)) {
            throw new Error('Please enter a valid email')
          }
          return [4 /*yield*/, getUser({ email: email })]
        case 2:
          user = _b.sent()
          if (!user) {
            throw new Error('Invalid credentials')
          }
          return [4 /*yield*/, bcrypt.compare(password, user.password)]
        case 3:
          isMatch = _b.sent()
          if (!isMatch) {
            throw new Error('Invalid credentials')
          }
          token = jsonwebtoken.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d',
          })
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
          return [3 /*break*/, 5]
        case 4:
          error_1 = _b.sent()
          console.log('error: ', error_1)
          next(error_1)
          return [3 /*break*/, 5]
        case 5:
          return [2 /*return*/]
      }
    })
  })
})
// Authorization middleware
app.use(isAuth)
// shorten a new url
app.post('/api/shorten', function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var destination, isUrlFound, newUrl, error_2
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          destination = req.body.destination
          _a.label = 1
        case 1:
          _a.trys.push([1, 4, , 5])
          if (!destination) {
            throw new Error('Please enter a url to shorten')
          }
          if (!validateUrl(destination)) {
            throw new Error('Please enter a valid url')
          }
          return [4 /*yield*/, getOneUrl({ destination: destination })]
        case 2:
          isUrlFound = _a.sent()
          if (isUrlFound) {
            throw new Error('URL already found, please choose another url')
          }
          newUrl = {
            destination: destination,
            short: nanoid(7),
            clicks: 0,
          }
          return [4 /*yield*/, shortenUrl(newUrl)]
        case 3:
          _a.sent()
          res.status(201).json({
            success: true,
            url: newUrl,
          })
          return [3 /*break*/, 5]
        case 4:
          error_2 = _a.sent()
          next(error_2)
          return [3 /*break*/, 5]
        case 5:
          return [2 /*return*/]
      }
    })
  })
})
// get all urls
app.get('/api/urls', function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a, createdAt, clicks, page, sort, urls, error_3
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ;(_a = req.query),
            (createdAt = _a.createdAt),
            (clicks = _a.clicks),
            (page = _a.page)
          sort = {}
          if (createdAt) sort['createdAt'] = createdAt
          if (clicks) sort['clicks'] = clicks
          if (page) sort['page'] = Number(page)
          _b.label = 1
        case 1:
          _b.trys.push([1, 3, , 4])
          return [4 /*yield*/, getAllUrls(__assign({}, sort))]
        case 2:
          urls = _b.sent()
          res.status(200).json({
            success: true,
            urls: urls,
          })
          return [3 /*break*/, 4]
        case 3:
          error_3 = _b.sent()
          next(error_3)
          return [3 /*break*/, 4]
        case 4:
          return [2 /*return*/]
      }
    })
  })
})
// filter urls based on query
app.get('/api/urls/filter', function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var urls, error_4
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3])
          return [4 /*yield*/, filterUrls(req.query)]
        case 1:
          urls = _a.sent()
          res.status(200).json({
            success: true,
            urls: urls,
          })
          return [3 /*break*/, 3]
        case 2:
          error_4 = _a.sent()
          next(error_4)
          return [3 /*break*/, 3]
        case 3:
          return [2 /*return*/]
      }
    })
  })
})
// delete a url
app.delete('/api/:short', function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var short, url, error_5
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          short = req.params.short
          _a.label = 1
        case 1:
          _a.trys.push([1, 3, , 4])
          return [4 /*yield*/, deleteUrl(short)]
        case 2:
          url = _a.sent()
          if (!url) {
            throw new Error('No url found')
          }
          res.status(200).json({
            success: true,
            url: url,
          })
          return [3 /*break*/, 4]
        case 3:
          error_5 = _a.sent()
          next(error_5)
          return [3 /*break*/, 4]
        case 4:
          return [2 /*return*/]
      }
    })
  })
})
// redirect to the destination url
app.get('/:short', function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var short, url
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          short = req.params.short
          return [4 /*yield*/, getOneUrl({ short: short })]
        case 1:
          url = _a.sent()
          if (!!url) return [3 /*break*/, 2]
          res.sendFile(path.join(process.cwd(), 'server', 'views', '404.html'))
          return [2 /*return*/]
        case 2:
          return [4 /*yield*/, updateUrlClicks(short)]
        case 3:
          _a.sent()
          res.redirect(url.destination)
          _a.label = 4
        case 4:
          return [2 /*return*/]
      }
    })
  })
})
// logout
app.post('/api/logout', function (req, res) {
  res.clearCookie('token')
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
})
app.use(notFound)
app.use(errorHandler)
var PORT = process.env.PORT || 5000
app.listen(PORT, function () {
  console.log('Server running on port '.concat(PORT))
})

import User from '../models/users.js'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import { validateEmail, expireAt } from '../util/utils.js'

export const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name, roles } = req.body
  if (!email || !password || !name || !roles?.length) {
    throw new Error('Please enter all fields')
  }
  if (!validateEmail(email)) {
    throw new Error('Please enter a valid email')
  }
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new Error('User already exists')
  }
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const user = await User.create({
    fullName: name,
    email,
    password: hashedPassword,
    roles: roles ? roles : ['EG85T'],
  })
  if (user) {
    res.status(201).json({
      success: true,
      message: 'User created successfully',
    })
  }
})

export const authenticateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new Error('Please enter your email and password')
  }
  if (!validateEmail(email)) {
    throw new Error('Please enter a valid email')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Invalid credentials')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Invalid credentials')
  }
  const token = jsonwebtoken.sign({ _id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  })
  const rl = user.roles.map((r) => ({ code: r }))
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  })
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      rl,
      expireAt: expireAt(1),
    },
  })
})

export const userLogout = asyncHandler(async (req, res) => {
  res.clearCookie('token')
  res.status(200).json({
    success: true,
  })
})

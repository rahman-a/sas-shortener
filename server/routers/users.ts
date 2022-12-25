import express, { Router } from 'express'
const router: Router = express.Router()
import {
  registerUser,
  authenticateUser,
  userLogout,
} from '../controllers/users.js'
import { isAuthenticated } from '../middleware/auth.js'

router.post('/register', registerUser)
router.post('/login', authenticateUser)
router.post('/logout', isAuthenticated, userLogout)

export default router

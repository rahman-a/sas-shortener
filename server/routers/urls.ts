import type { Router } from 'express'
import express from 'express'
const router: Router = express.Router()
import {
  createShortUrl,
  getAllShortUrls,
  getShortUrl,
  deleteShortUrl,
} from '../controllers/urls.js'

import { isAuthenticated, isAuthorized } from '../middleware/auth.js'

router.post(
  '/shorten',
  isAuthenticated,
  isAuthorized('manage_urls'),
  createShortUrl
)
router.get('/', isAuthenticated, isAuthorized('manage_urls'), getAllShortUrls)
router.get('/:id', isAuthenticated, isAuthorized('manage_urls'), getShortUrl)
router.delete(
  '/:id',
  isAuthenticated,
  isAuthorized('manage_urls'),
  deleteShortUrl
)
export default router

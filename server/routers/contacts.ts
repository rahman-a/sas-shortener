import express, { Router } from 'express'
const router: Router = express.Router()

import {
  getContacts,
  postContact,
  deleteContact,
} from '../controllers/contacts.js'
import { isAuthenticated, isAuthorized } from '../middleware/auth.js'

router.get('/', isAuthenticated, isAuthorized('manage_contacts'), getContacts)
router.post('/', postContact)
router.delete(
  '/:id',
  isAuthenticated,
  isAuthorized('manage_contacts'),
  deleteContact
)

export default router

import express, { Router } from 'express'

const router: Router = express.Router()
import {
  newApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} from '../controllers/applications.js'
import { isAuthenticated, isAuthorized } from '../middleware/auth.js'

router
  .route('/:id?')
  .post(newApplication)
  .get(isAuthenticated, isAuthorized('manage_jobs'), getApplications)
  .patch(isAuthenticated, isAuthorized('manage_jobs'), updateApplicationStatus)
  .delete(isAuthenticated, isAuthorized('manage_jobs'), deleteApplication)

export default router

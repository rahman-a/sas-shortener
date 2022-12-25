import express, { Router } from 'express'

const router: Router = express.Router()
import {
  createJob,
  getAllJobs,
  deleteJob,
  updateJob,
  getAllSkills,
} from '../controllers/jobs.js'
import { isAuthenticated, isAuthorized } from '../middleware/auth.js'

router.get('/', isAuthenticated, isAuthorized('manage_jobs'), getAllJobs)
router.post('/', isAuthenticated, isAuthorized('manage_jobs'), createJob)
router.delete('/:id', isAuthenticated, isAuthorized('manage_jobs'), deleteJob)
router.put('/:id', isAuthenticated, isAuthorized('manage_jobs'), updateJob)
router.get('/filtered', getAllJobs)
router.get('/skills', getAllSkills)

export default router

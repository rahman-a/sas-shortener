// notes on resume upload
//  resume size limit is 5MB
//  resume format is pdf
import Applications from '../models/applications.js'
import asyncHandler from 'express-async-handler'
import path from 'path'
import { UploadedFile } from '../types/custom/index.js'
import { validateEmail } from '../util/utils.js'
import {
  BodyApplicationsQueries,
  ApplicationsQueriesObject,
} from '../types/custom/index.js'
const RESUMES_DIR = path.join(process.cwd(), 'server', 'uploads/resumes')

type Status = 'applied' | 'interviewing' | 'offered' | 'rejected'

// new application
export const newApplication = asyncHandler(async (req, res) => {
  const { job, firstName, lastName, email, phone, country, address } = req.body
  if (!job || !firstName || !lastName || !email || !country) {
    res.status(400)
    throw new Error('Please fill all required fields')
  }
  if (!validateEmail(email)) {
    res.status(400)
    throw new Error('Please enter a valid email address')
  }
  // check if applicant already applied for this job
  const isApplicationExists = await Applications.findOne({ job, email })
  if (isApplicationExists) {
    res.status(400)
    throw new Error("You've already applied for this job")
  }
  //check if resume is uploaded
  if (!req.files?.resume || Object.keys(req.files!).length === 0) {
    res.status(400)
    throw new Error('Please upload your resume')
  }
  const resume = req.files!.resume as UploadedFile
  const resumeExtension = path.extname(resume.name)
  if (resumeExtension !== '.pdf') {
    res.status(400)
    throw new Error('Please upload a resume in PDF format')
  }
  if (resume.truncated) {
    res.status(400)
    throw new Error(
      'resume size is too large, please upload a file less than 5MB'
    )
  }

  // use expressUploader save the uploaded resume
  const resumeName = `${Date.now()}-${resume.name}`
  resume.mv(`${RESUMES_DIR}/${resumeName}`, (err) => {
    if (err) {
      console.error(err)
      res.status(500)
      throw new Error('Server error, please try again')
    }
  })

  const application = await Applications.create({
    job,
    firstName,
    lastName,
    email,
    phone,
    country,
    address,
    resume: resumeName,
  })
  if (application) {
    res.status(201).json({
      applicationId: application.applicationId,
      success: true,
      message: 'Your application submitted successfully',
    })
  } else {
    res.status(400)
    throw new Error('Invalid application data, please try again')
  }
})

// get all applicants
export const getApplications = asyncHandler(async (req, res) => {
  const {
    applicationId,
    firstName,
    lastName,
    email,
    phone,
    country,
    address,
    status,
    page,
    job,
    createdAt,
  } = req.query as BodyApplicationsQueries
  const queries: ApplicationsQueriesObject = {}
  if (applicationId) queries.applicationId = applicationId
  if (firstName) queries.firstName = { $regex: firstName, $options: 'i' }
  if (lastName) queries.lastName = { $regex: lastName, $options: 'i' }
  if (email) queries.email = { $regex: email, $options: 'i' }
  if (phone) queries.phone = phone
  if (country) queries.country = { $regex: country, $options: 'i' }
  if (address) queries.address = { $regex: address, $options: 'i' }
  if (status) queries.status = status
  const applications = await Applications.find({
    ...queries,
  })
    .limit(10)
    .skip(10 * (Number(page) - 1))
    .sort({ createdAt: createdAt ? createdAt : -1 })
    .populate({
      path: 'job',
      select: 'title jobId',
      match: job ? { jobId: { $eq: job } } : {},
    })
  res.json({
    applications: applications.filter((app) => app.job !== null),
    success: true,
  })
})
// update applicant status
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status } = req.query
  const application = await Applications.findById(id)
  console.log(
    '🚀 ~ file: applications.ts:133 ~ updateApplicationStatus ~ application',
    application
  )
  if (!application) {
    res.status(404)
    throw new Error('Application not found')
  }
  application.status = status as Status
  const updatedApplication = await application.save()
  res.json({
    success: true,
    application: updatedApplication,
    message: 'Application status updated successfully',
  })
})
// delete applicant
export const deleteApplication = asyncHandler(async (req, res) => {
  const { id } = req.params
  const application = await Applications.findById(id)
  if (!application) {
    res.status(404)
    throw new Error('Application not found')
  }
  await application.remove()
  res.json({
    success: true,
    application,
    message: 'Application deleted successfully',
  })
})

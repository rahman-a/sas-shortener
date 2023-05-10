import Job from '../models/jobs.js'
import asyncHandler from 'express-async-handler'
import { Job as JobType } from '../types/custom'
import { nanoid } from 'nanoid'
interface JobQueries {
  jobId?: string
  title?: string
  company?: string
  jobType?: string
  country?: string
  salary?: string
  page?: string
  description?: string
  skills?: string[]
  createdAt?: 'asc' | 'desc'
}

interface QueriesObject {
  jobId?: string
  title?: { $regex: string; $options: string }
  company?: { $regex: string; $options: string }
  jobType?: string
  country?: { $regex: string; $options: string }
  salary?: { $lte: number }
}

export const getAllJobs = asyncHandler(async (req, res) => {
  const { jobId, title, company, jobType, country, salary, page, createdAt } =
    req.query as JobQueries
  const queries = {} as QueriesObject
  if (jobId) queries.jobId = jobId
  if (title) queries.title = { $regex: title, $options: 'i' }
  if (company) queries.company = { $regex: company, $options: 'i' }
  if (jobType) queries.jobType = jobType
  if (country) queries.country = { $regex: country, $options: 'i' }
  if (salary) queries.salary = { $lte: Number(salary) }
  console.log('🚀  queries', queries)
  const jobs = await Job.find(queries)
    .limit(10)
    .skip(10 * (Number(page) - 1))
    .sort({ createdAt: createdAt ? createdAt : -1 })

  res.json({
    jobs,
    success: true,
  })
})

//  create new job
export const createJob = asyncHandler(async (req, res) => {
  const {
    jobId,
    title,
    description,
    company,
    jobType,
    skills,
    country,
    salary,
  } = req.body as JobQueries
  if (
    !jobId ||
    !title ||
    !description ||
    !company ||
    !jobType ||
    !skills ||
    !country
  ) {
    res.status(400)
    throw new Error('Please fill in all fields')
  }
  const job = await Job.create({
    jobId,
    title,
    description,
    company,
    jobType,
    skills,
    country,
    salary: salary ? Number(salary) : 0,
  })
  res.json({
    job,
    success: true,
  })
})

// get job by id
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
  if (job) {
    res.json({
      job,
      success: true,
    })
  } else {
    res.status(404)
    throw new Error('Job not found')
  }
})

// update job
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
  if (job) {
    for (const key in req.body) {
      if (job[key as keyof JobType] !== req.body[key]) {
        ;(job[key as keyof JobType] as string) = req.body[key]
      }
    }
    const updatedJob = await job.save()
    res.json({
      job: updatedJob,
      success: true,
    })
  } else {
    res.status(404)
    throw new Error('Job not found')
  }
})

// delete job
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
  if (job) {
    await job.remove()
    res.json({
      job,
      success: true,
    })
  } else {
    res.status(404)
    throw new Error('Job not found')
  }
})
//  get all skills
export const getAllSkills = asyncHandler(async (req, res) => {
  const jobs = await Job.find({})
  const skills = jobs.reduce((acc, job) => {
    acc.push(...job.skills)
    return acc
  }, [] as string[])
  const uniqueSkills = Array.from(new Set(skills))
  res.json({
    skills: uniqueSkills.map((skill) => ({ keyword: skill, _id: nanoid() })),
    success: true,
  })
})

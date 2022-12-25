import { rootURL } from './index'
import { Job, JobQueries } from '../types'
import { getQueryString } from '../utils'
import { QueryFunctionContext } from 'react-query'

const createJob = async (
  job: Job
): Promise<{
  success: boolean
  job: Job
}> => {
  const response = await fetch(`${rootURL}/jobs`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(job),
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

const getJobs = async (
  queries: QueryFunctionContext
): Promise<{
  success: boolean
  jobs: Job[]
}> => {
  const sortQuery = queries.queryKey[1] as JobQueries
  if (queries.pageParam) sortQuery.page = queries.pageParam.toString()
  const queriesString = getQueryString(sortQuery)
  const response = await fetch(`${rootURL}/jobs${queriesString}`, {
    credentials: 'include',
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

const updateJob = async (
  id: string,
  job: JobQueries
): Promise<{
  success: boolean
  job: Job
}> => {
  const response = await fetch(`${rootURL}/jobs/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(job),
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

const deleteJob = async (
  id: string
): Promise<{
  success: boolean
  job: Job
}> => {
  const response = await fetch(`${rootURL}/jobs/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

export default {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
}

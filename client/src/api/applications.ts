import { rootURL } from './index'
import type { Applications, ApplicationsQuery } from '../types'
import { getQueryString } from '../utils'
import { QueryFunctionContext } from 'react-query'

type Status = Applications['status']
type TStatusVariables = {
  id: string
  status: Status
}

const getApplications = async (
  queries: QueryFunctionContext
): Promise<{
  success: boolean
  applications: Applications[]
}> => {
  const sortQuery = queries.queryKey[1] as ApplicationsQuery
  if (queries.pageParam) sortQuery.page = queries.pageParam.toString()
  const queriesString = getQueryString(sortQuery)
  const response = await fetch(`${rootURL}/applications${queriesString}`, {
    credentials: 'include',
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

const updateApplicationStatus = async ({
  id,
  status,
}: TStatusVariables): Promise<{
  success: boolean
  application: Applications
}> => {
  const response = await fetch(
    `${rootURL}/applications/${id}?status=${status}`,
    {
      method: 'PATCH',
      credentials: 'include',
    }
  )
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

const deleteApplication = async (
  id: string
): Promise<{
  success: boolean
  application: Applications
}> => {
  const response = await fetch(`${rootURL}/applications/${id}`, {
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
  getApplications,
  updateApplicationStatus,
  deleteApplication,
}

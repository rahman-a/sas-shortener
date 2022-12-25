import { rootURL } from './index'
import { QueryFunctionContext } from 'react-query'
import { getQueryString } from '../utils'

interface URL {
  _id: string
  original_url: string
  shortId: string
  short_url: string
  clicks: number
  createdAt: string
  updatedAt: string
}

interface URLQuery {
  original_url?: string
  short_url?: string
  clicks?: string
}

interface SortQuery {
  createdAt?: 'asc' | 'desc'
  count?: 'asc' | 'desc'
  page?: string
}

const getUrls = async (
  sort: QueryFunctionContext
): Promise<{ success: boolean; urls: URL[] }> => {
  console.log('fetch all urls')
  const sortQuery: SortQuery = sort.queryKey[1] as SortQuery
  if (sort.pageParam) sortQuery['page'] = sort.pageParam.toString()
  const queryObject = getQueryString(sortQuery)
  const response = await fetch(`${rootURL}/urls${queryObject}`, {
    credentials: 'include',
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

const shortenUrl = async (
  destinationUrl: string
): Promise<{ success: boolean; url: URL }> => {
  const response = await fetch(`${rootURL}/urls/shorten`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({ original_url: destinationUrl }),
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

const deleteUrl = async (
  urlShort: string
): Promise<{ success: boolean; url: URL }> => {
  const response = await fetch(`${rootURL}/urls/${urlShort}`, {
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
  getUrls,
  shortenUrl,
  deleteUrl,
}

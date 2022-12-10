const rootURL = 'http://localhost:5000/api'
import { QueryFunctionContext } from 'react-query'

interface URL {
  destination: string
  short: string
  clicks: number
  createdAt: string
  updatedAt: string
}

interface URLQuery {
  destination?: string
  short?: string
  clicks?: string
}

interface Credential {
  email: string
  password: string
}

interface ReturnedLoginData {
  success: boolean
  user: {
    id: string
    expireAt: number
  }
}

interface SortQuery {
  createdAt?: string
  clicks?: string
  page?: string
}

export const login = async (
  credential: Credential
): Promise<ReturnedLoginData> => {
  const response = await fetch(`${rootURL}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(credential),
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

export const getUrls = async (
  sort: QueryFunctionContext
): Promise<{ success: boolean; urls: URL[] }> => {
  const query: SortQuery = {}
  const sortQuery: SortQuery = sort.queryKey[1] as SortQuery
  if (sortQuery.createdAt) query['createdAt'] = sortQuery.createdAt
  if (sortQuery.clicks) query['clicks'] = sortQuery.clicks
  if (sort.pageParam) query['page'] = sort.pageParam.toString()
  const queryObject = new URLSearchParams({ ...query }).toString()
  const response = await fetch(`${rootURL}/urls?${queryObject}`, {
    credentials: 'include',
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

export const filterUrls = async ({
  ...query
}: URLQuery): Promise<{ success: boolean; urls: URL[] }> => {
  const queryObject = new URLSearchParams(query).toString()
  const response = await fetch(`${rootURL}/urls/filter?${queryObject}`, {
    credentials: 'include',
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

export const shortenUrl = async (
  destinationUrl: string
): Promise<{ success: boolean; url: URL }> => {
  const response = await fetch(`${rootURL}/shorten`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({ destination: destinationUrl }),
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

export const deleteUrl = async (
  urlShort: string
): Promise<{ success: boolean; url: URL }> => {
  const response = await fetch(`${rootURL}/${urlShort}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

export const logout = async (): Promise<{ success: boolean }> => {
  const response = await fetch(`${rootURL}/logout`, {
    method: 'POST',
    credentials: 'include',
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

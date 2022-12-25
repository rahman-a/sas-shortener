import { rootURL } from './index'
import type { Contact, ContactsQueries } from '../types'
import { getQueryString } from '../utils'
import { QueryFunctionContext } from 'react-query'

const getContacts = async (
  queries: QueryFunctionContext
): Promise<{
  success: boolean
  contacts: Contact[]
}> => {
  console.log('api queries: ', queries)
  const sortQuery = queries.queryKey[1] as ContactsQueries & { page: string }
  if (queries.pageParam) sortQuery.page = queries.pageParam.toString()
  const queriesString = getQueryString(sortQuery)
  const response = await fetch(`${rootURL}/contacts${queriesString}`, {
    credentials: 'include',
  })
  const data = await response.json()
  if (response.ok) {
    return data
  }
  throw new Error(data.message)
}

const deleteContact = async (
  id: string
): Promise<{
  success: boolean
  contact: Contact
}> => {
  const response = await fetch(`${rootURL}/contacts/${id}`, {
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
  getContacts,
  deleteContact,
}

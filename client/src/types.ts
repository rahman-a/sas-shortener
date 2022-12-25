export type Arrange = 'asc' | 'desc'

export interface URL {
  _id: string
  original_url: string
  shortId: string
  short_url: string
  clicks: number
  createdAt?: Date
  updatedAt?: Date
}

export interface URLsQueries {
  original_url?: string
  shortId?: string
  createdAt?: Arrange
  count?: Arrange
}

export interface Contact {
  _id: string
  name: string
  email: string
  phone?: string
  organization?: string
  role?: string
  location?: string
  inquiry: string
  subject: string
  message?: string
  createdAt?: string
  updatedAt?: string
}

export interface ContactsQueries {
  name?: string
  email?: string
  phone?: string
  organization?: string
  role?: string
  inquiry?: 'general' | 'proposal' | 'employment'
  location?: string
  createdAt?: string
}

export interface Job {
  _id?: string
  jobId: string
  title: string
  description: string
  company: string
  jobType: string
  skills: string[]
  country: string
  salary?: number
  createdAt?: string
  updatedAt?: string
}

export interface JobQueries {
  _id?: string
  jobId?: string
  title?: string
  company?: string
  jobType?: string
  country?: string
  salary?: string
  page?: string
  description?: string
  skills?: string[]
  createdAt?: Arrange
}

export interface Applications {
  _id?: string
  applicationId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country?: string
  address?: string
  resume?: string
  status: 'applied' | 'interviewing' | 'offered' | 'rejected'
  job: {
    _id: string
    title: string
    jobId: string
  }
  createdAt?: Arrange
  updatedAt?: Arrange
}

export interface ApplicationsQuery {
  firstName?: string
  lastName?: string
  applicationId: string
  email?: string
  phone?: string
  country?: string
  address?: string
  status?: 'applied' | 'interviewing' | 'offered' | 'rejected'
  job?: string
  page?: string
  createdAt?: Arrange
}

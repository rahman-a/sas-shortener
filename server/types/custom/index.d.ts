import expressFileUpload from 'express-fileupload'

export type UploadedFile = expressFileUpload.UploadedFile
export interface Contact {
  _id: string
  name: string
  email: string
  phone?: string
  organization?: string
  role?: string
  location?: string
  inquiry: 'general' | 'proposal' | 'employment'
  subject: string
  message?: string
  createdAt: string
  updatedAt: string
}

export interface Job {
  _id: string
  jobId: string
  title: string
  description: string
  company: string
  jobType: string
  skills: string[]
  country: string
  salary?: number
  createdAt: string
  updatedAt: string
}

export interface BodyContactsQueries {
  name?: string
  email?: string
  phone?: string
  organization?: string
  role?: string
  inquiry?: 'general' | 'proposal' | 'employment'
  location?: string
  page?: string
  createdAt?: 'asc' | 'desc'
}

export interface ContactQueriesObject {
  name?: { $regex: string; $options: string }
  email?: { $regex: string; $options: string }
  phone?: string
  organization?: { $regex: string; $options: string }
  role?: { $regex: string; $options: string }
  inquiry?: 'general' | 'proposal' | 'employment'
  location?: { $regex: string; $options: string }
  page?: string
  createdAt?: 'asc' | 'desc'
}

export interface BodyApplicationsQueries {
  applicationId?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  country?: string
  address?: string
  status?: 'applied' | 'interviewing' | 'offered' | 'rejected'
  page?: string
  job?: string
  createdAt?: 'asc' | 'desc'
}
export interface ApplicationsQueriesObject {
  applicationId?: string
  firstName?: { $regex: string; $options: string }
  lastName?: { $regex: string; $options: string }
  email?: { $regex: string; $options: string }
  phone?: string
  country?: { $regex: string; $options: string }
  address?: { $regex: string; $options: string }
  status?: 'applied' | 'interviewing' | 'offered' | 'rejected'
  page?: string
  job?: string
  createdAt?: 'asc' | 'desc'
}

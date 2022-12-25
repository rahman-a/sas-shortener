import Contacts from '../models/contacts.js'
import asyncHandler from 'express-async-handler'
import {
  BodyContactsQueries,
  ContactQueriesObject,
} from '../types/custom/index.js'

const tracks: any = []

// Get all contacts
export const getContacts = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    organization,
    role,
    inquiry,
    location,
    page,
    createdAt,
  } = req.query as BodyContactsQueries
  const queries: ContactQueriesObject = {}
  if (name) queries.name = { $regex: name, $options: 'i' }
  if (email) queries.email = { $regex: email, $options: 'i' }
  if (phone) queries.phone = phone
  if (organization)
    queries.organization = { $regex: organization, $options: 'i' }
  if (role) queries.role = { $regex: role, $options: 'i' }
  if (inquiry) queries.inquiry = inquiry
  if (location) queries.location = { $regex: location, $options: 'i' }
  const contacts = await Contacts.find(queries)
    .skip(page ? (Number(page) - 1) * 10 : 0)
    .limit(10)
    .sort({ createdAt: createdAt ? createdAt : -1 })
  res.json({
    contacts,
    success: true,
  })
})
// POST contact
export const postContact = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    organization,
    role,
    inquiry,
    location,
    subject,
    message,
  } = req.body
  if (!name || !email || !inquiry || !subject) {
    throw new Error('Please provide the required fields')
  }
  const contact = await Contacts.create({
    name,
    email,
    phone,
    organization,
    role,
    inquiry,
    location,
    subject,
    message,
  })
  res.status(201).json({
    contact,
    success: true,
  })
})
// DELETE contact
export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params
  const contact = await Contacts.findById(id)
  if (!contact) {
    throw new Error('Contact not found')
  }
  await contact.remove()
  res.json({
    contact,
    success: true,
  })
})

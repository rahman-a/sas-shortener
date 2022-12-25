import mongoose from 'mongoose'
import type { Contact } from '../types/custom'

const contactSchema = new mongoose.Schema<Contact>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    organization: {
      type: String,
    },
    role: {
      type: String,
    },
    location: {
      type: String,
    },
    inquiry: {
      type: String,
      required: true,
      enum: ['general', 'proposal', 'employment'],
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Contact', contactSchema)

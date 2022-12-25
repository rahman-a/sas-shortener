import mongoose from 'mongoose'
import { Job } from '../types/custom'

const jobSchema = new mongoose.Schema<Job>(
  {
    jobId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
      enum: ['full time', 'part time', 'contract', 'internship'],
    },
    skills: {
      type: [String],
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
)

// create mongoose model for job model
export default mongoose.model('Job', jobSchema)

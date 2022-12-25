import mongoose from 'mongoose'

// use nanoid to generate unique id
import { nanoid } from 'nanoid'

// create mongoose schema for applicant model
const applicationsSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      default: () => nanoid(12),
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
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
    country: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    resume: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['applied', 'interviewing', 'offered', 'rejected'],
      default: 'applied',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Applications', applicationsSchema)

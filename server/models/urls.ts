import mongoose from 'mongoose'

interface Url {
  shortId: string
  short_url: string
  original_url: string
  clicks: number
  createdAt: Date
  updatedAt: Date
}

const urlSchema = new mongoose.Schema<Url>(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    short_url: {
      type: String,
      required: true,
      unique: true,
    },
    original_url: {
      type: String,
      required: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<Url>('Url', urlSchema)

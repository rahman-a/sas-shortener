import mongoose from 'mongoose'

type Roles = 'EG85T' | 'EF79V' | 'DR45F' | 'QB13D'
interface User {
  fullName: string
  email: string
  password: string
  roles: Roles[]
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema<User>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    roles: {
      type: [String],
      required: true,
      default: ['EG85T'],
      enum: ['EG85T', 'EF79V', 'DR45F', 'QB13D'],
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<User>('User', userSchema)

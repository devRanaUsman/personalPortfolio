import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    projectType: { type: String, trim: true, maxlength: 60, default: '' },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
  },
  { timestamps: true }
)

export default mongoose.model('Message', messageSchema)

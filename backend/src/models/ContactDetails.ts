import mongoose, { Document, Schema } from 'mongoose';

export interface IContactDetails extends Document {
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  resume?: string; // Internal blob URL
  resumePublicUrl?: string; // Public custom domain URL
  updatedAt: Date;
}

const contactDetailsSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true,
    default: ''
  },
  github: {
    type: String,
    trim: true,
    default: ''
  },
  twitter: {
    type: String,
    trim: true,
    default: ''
  },
  resume: {
    type: String,
    trim: true,
    default: ''
  },
  resumePublicUrl: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model<IContactDetails>('ContactDetails', contactDetailsSchema);
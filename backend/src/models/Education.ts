
import mongoose, { Document, Schema } from 'mongoose';

export interface IEducation extends Document {
  type: 'degree' | 'certification' | 'course';
  title: string;
  institution: string;
  location?: string;
  period: string;
  description: string[];
  grade?: string;
  status: 'completed' | 'in-progress';
  highlights?: string[];
}

const educationSchema = new Schema({
  type: {
    type: String,
    enum: ['degree', 'certification', 'course'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  institution: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  period: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: [String],
    required: true
  },
  grade: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress'],
    required: true
  },
  highlights: {
    type: [String]
  }
}, {
  timestamps: true
});

export default mongoose.model<IEducation>('Education', educationSchema);

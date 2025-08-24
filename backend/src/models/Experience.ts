
import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
  type: 'education' | 'project' | 'learning' | 'goal';
  title: string;
  organization?: string;
  location?: string;
  period: string;
  description: string[];
  technologies?: string[];
  current?: boolean;
}

const experienceSchema = new Schema({
  type: {
    type: String,
    enum: ['education', 'project', 'learning', 'goal'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  organization: {
    type: String,
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
  technologies: {
    type: [String]
  },
  current: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model<IExperience>('Experience', experienceSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  challenge?: string;
  solution?: string;
  impact?: string;
  duration?: string;
  team?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  technologies: [{
    type: String,
    required: true
  }],
  imageUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  liveUrl: {
    type: String,
    default: ''
  },
  featured: {
    type: Boolean,
    default: false
  },
  challenge: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  solution: {
    type: String,
    maxlength: 1500,
    default: ''
  },
  impact: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  duration: {
    type: String,
    maxlength: 50,
    default: ''
  },
  team: {
    type: String,
    maxlength: 100,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model<IProject>('Project', projectSchema);
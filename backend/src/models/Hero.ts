import mongoose, { Document, Schema } from 'mongoose';

export interface IHero extends Document {
  greeting: string;
  name: string;
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  resumeButtonText: string;
  updatedAt: Date;
}

const HeroSchema: Schema = new Schema({
  greeting: {
    type: String,
    required: true,
    default: "Hi, I'm"
  },
  name: {
    type: String,
    required: true,
    default: "AAYUSH GUPTA"
  },
  title: {
    type: String,
    required: true,
    default: "FULL STACK DEVELOPER"
  },
  description: {
    type: String,
    required: true,
    default: "Creating modern web applications with cutting-edge technologies. Passionate about clean code, user experience, and innovative solutions."
  },
  primaryButtonText: {
    type: String,
    required: true,
    default: "View My Work"
  },
  secondaryButtonText: {
    type: String,
    required: true,
    default: "Get In Touch"
  },
  resumeButtonText: {
    type: String,
    required: true,
    default: "Resume"
  }
}, {
  timestamps: true
});

export default mongoose.model<IHero>('Hero', HeroSchema);
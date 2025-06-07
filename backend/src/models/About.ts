import mongoose, { Document, Schema } from 'mongoose';

export interface IAbout extends Document {
  backgroundTitle: string;
  backgroundContent: string;
  experienceTitle: string;
  experienceContent: string;
  skills: string[];
  resumeDescription: string;
  updatedAt: Date;
}

const AboutSchema: Schema = new Schema({
  backgroundTitle: {
    type: String,
    required: true,
    default: "BACKGROUND"
  },
  backgroundContent: {
    type: String,
    required: true,
    default: "I'm Aayush Gupta, a passionate full-stack developer with expertise in modern web technologies. I love creating efficient, scalable applications that provide excellent user experiences. My journey in tech started with curiosity and has evolved into a commitment to continuous learning and building innovative solutions."
  },
  experienceTitle: {
    type: String,
    required: true,
    default: "EXPERIENCE"
  },
  experienceContent: {
    type: String,
    required: true,
    default: "With experience in both frontend and backend development, I specialize in the MERN stack and modern frameworks. I enjoy working on challenging projects that push the boundaries of what's possible on the web."
  },
  skills: [{
    type: String,
    required: true
  }],
  resumeDescription: {
    type: String,
    required: true,
    default: "Download or preview my complete resume to learn more about my experience and qualifications."
  }
}, {
  timestamps: true
});

// Set default skills if none provided
AboutSchema.pre<IAbout>('save', function(next) {
  if (this.skills.length === 0) {
    this.skills = [
      'React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
      'Tailwind CSS', 'Next.js', 'Python', 'AWS', 'Docker', 'Git'
    ];
  }
  next();
});

export default mongoose.model<IAbout>('About', AboutSchema);
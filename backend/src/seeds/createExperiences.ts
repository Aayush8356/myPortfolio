
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Experience from '../models/Experience';

dotenv.config();

const experiences = [
  {
    type: 'goal',
    title: 'Actively Seeking Full Stack Developer Opportunities',
    period: '2024 - Present',
    description: [
      'Focusing on expanding backend expertise and exploring cloud technologies',
      'Building additional portfolio projects with Next.js and PostgreSQL',
      'Learning DevOps tools and deployment strategies for scalable applications',
      'Seeking full-time opportunities to contribute to impactful software solutions'
    ],
    technologies: ['Next.js', 'PostgreSQL', 'AWS', 'TypeScript', 'DevOps'],
    current: true
  },
  {
    type: 'project',
    title: 'MERN Stack Development & Project Building',
    period: '2023 - Present',
    description: [
      'Self-taught MERN stack through hands-on project development and real-world problem solving',
      'Built Wandarlog: Travel planning platform handling 500+ concurrent users with real-time features',
      'Developed Web Food: Food delivery app with payment integration, GPS tracking, and order management',
      'Created Payment UI Component: Reusable React library reducing development time by 40%',
      'Deployed applications using Vercel and Render with optimized performance and caching strategies'
    ],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'JWT', 'RESTful APIs', 'Vercel', 'Render']
  },
  {
    type: 'education',
    title: 'Computer Science & Engineering Degree',
    organization: 'Chandigarh University',
    location: 'Punjab, India',
    period: '2020 - 2024',
    description: [
      'Graduated with strong foundation in software engineering and computer science fundamentals',
      'Specialized in web development during final years with focus on modern technologies',
      'Completed capstone projects involving full-stack development and database design',
      'Built solid understanding of algorithms, data structures, and software design patterns'
    ],
    technologies: ['Java', 'Python', 'Data Structures', 'Algorithms', 'Software Engineering', 'Database Systems']
  }
];

const seedExperiences = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

    await Experience.deleteMany({});
    console.log('Cleared existing experiences');

    await Experience.insertMany(experiences);
    console.log('Seeded experiences');

    mongoose.connection.close();
  } catch (error) {
    console.error('Failed to seed experiences:', error);
    process.exit(1);
  }
};

seedExperiences();

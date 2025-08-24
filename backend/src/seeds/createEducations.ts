
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Education from '../models/Education';

dotenv.config();

const educations = [
  {
    type: 'degree',
    title: 'Bachelor of Engineering - Computer Science & Engineering',
    institution: 'Chandigarh University',
    location: 'Punjab, India',
    period: '2020 - 2024',
    status: 'completed',
    description: [
      'Comprehensive 4-year engineering program focusing on computer science fundamentals and practical application',
      'Specialized coursework in software engineering, data structures, algorithms, and full-stack development',
      'Strong foundation in programming languages, database systems, and software design patterns',
      'Capstone projects involving real-world problem solving and modern web technologies'
    ],
    highlights: [
      'Software Engineering',
      'Data Structures & Algorithms',
      'Database Management',
      'Web Development',
      'Software Design Patterns',
      'Computer Networks'
    ]
  },
  {
    type: 'certification',
    title: 'MERN Stack Development Specialization',
    institution: 'Self-Directed Learning',
    period: '2023 - Present',
    status: 'completed',
    description: [
      'Intensive hands-on training in MongoDB, Express.js, React.js, and Node.js ecosystem',
      'Built multiple full-stack applications with real-world complexity and deployment',
      'Mastered modern development tools, version control, and deployment platforms',
      'Gained expertise in TypeScript, authentication systems, and API development'
    ],
    highlights: [
      'MongoDB & Mongoose',
      'Express.js & RESTful APIs',
      'React.js & State Management',
      'Node.js & Server Architecture',
      'TypeScript',
      'JWT Authentication'
    ]
  },
  {
    type: 'course',
    title: 'Advanced Web Development Bootcamp',
    institution: 'Online Learning Platforms',
    period: '2022 - 2023',
    status: 'completed',
    description: [
      'Comprehensive web development program covering frontend and backend technologies',
      'Hands-on projects with modern frameworks and industry best practices',
      'Focus on responsive design, performance optimization, and user experience',
      'Integration with cloud services and deployment strategies'
    ],
    highlights: [
      'HTML5, CSS3, JavaScript ES6+',
      'React.js & Component Architecture',
      'Tailwind CSS & Responsive Design',
      'Git Version Control',
      'Deployment & DevOps Basics'
    ]
  }
];

const seedEducations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

    await Education.deleteMany({});
    console.log('Cleared existing educations');

    await Education.insertMany(educations);
    console.log('Seeded educations');

    mongoose.connection.close();
  } catch (error) {
    console.error('Failed to seed educations:', error);
    process.exit(1);
  }
};

seedEducations();

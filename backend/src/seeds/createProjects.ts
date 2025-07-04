import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project';

dotenv.config();

const createProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    
    // Check if projects already exist
    const existingProjects = await Project.countDocuments();
    
    if (existingProjects > 0) {
      console.log('Projects already exist in database');
      return;
    }

    // Create real projects that match frontend defaults
    const sampleProjects = [
      {
        title: 'Wandarlog',
        description: 'Plan, travel and share your adventures. A comprehensive travel planning platform built with modern web technologies.',
        technologies: ['ReactJs', 'NodeJS', 'TailwindCSS', 'TypeScript', 'MongoDB'],
        imageUrl: '',
        githubUrl: 'https://github.com/Aayush8356/wanderlust',
        liveUrl: 'https://wanderlust-lilac-five.vercel.app/',
        featured: true
      },
      {
        title: 'Payment UI Component',
        description: 'A payment UI Component that you can easily import to your project. Modern, responsive, and customizable.',
        technologies: ['ReactJs', 'NodeJS', 'TailwindCSS', 'TypeScript', 'PostgreSQL'],
        imageUrl: '',
        githubUrl: 'https://github.com/Aayush8356/payment-ui',
        liveUrl: 'https://payment-ui-frontend-9gr7540uk-aayush8356s-projects.vercel.app',
        featured: false
      },
      {
        title: 'Web Food',
        description: 'Food Delivery App with real-time ordering, payment integration, and delivery tracking.',
        technologies: ['NextJs', 'NodeJS', 'MongoDB', 'Javascript'],
        imageUrl: '',
        githubUrl: 'https://github.com/Aayush8356/webfood',
        liveUrl: 'https://webfood.meetaayush.com',
        featured: true
      }
    ];

    await Project.insertMany(sampleProjects);
    console.log('Sample projects created successfully');
    console.log('Projects added:');
    sampleProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (Featured: ${project.featured})`);
    });
    
  } catch (error) {
    console.error('Error creating projects:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createProjects();
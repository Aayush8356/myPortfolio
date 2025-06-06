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

    // Create sample projects
    const sampleProjects = [
      {
        title: 'E-Commerce Platform',
        description: 'A full-stack e-commerce solution with user authentication, payment integration, and admin dashboard.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        imageUrl: '',
        githubUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        featured: true
      },
      {
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates and team collaboration features.',
        technologies: ['React', 'TypeScript', 'Express', 'Socket.io'],
        imageUrl: '',
        githubUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        featured: true
      },
      {
        title: 'Weather Dashboard',
        description: 'A responsive weather application with location-based forecasts and interactive charts.',
        technologies: ['React', 'Chart.js', 'Weather API', 'Tailwind CSS'],
        imageUrl: '',
        githubUrl: 'https://github.com',
        liveUrl: 'https://example.com',
        featured: false
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
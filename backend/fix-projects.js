const mongoose = require('mongoose');
require('dotenv').config();

// Define the Project schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [String],
  imageUrl: String,
  githubUrl: String,
  liveUrl: String,
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

const fixProjects = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');
    
    // Clear existing projects
    console.log('Removing old projects...');
    await Project.deleteMany({});
    console.log('Old projects removed.');
    
    // Add real projects
    console.log('Adding real projects...');
    const realProjects = [
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
    
    await Project.insertMany(realProjects);
    console.log('✅ Real projects added successfully!');
    
    // Verify projects
    const count = await Project.countDocuments();
    console.log(`Total projects in database: ${count}`);
    
    const projects = await Project.find({}, 'title featured');
    console.log('\nProjects in database:');
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (Featured: ${project.featured})`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing projects:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

fixProjects();
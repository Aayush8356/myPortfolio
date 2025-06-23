const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
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

const addProjectImages = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');
    
    // Get all projects
    const projects = await Project.find();
    console.log(`Found ${projects.length} projects`);
    
    // For now, let's add placeholder image URLs that we can replace later
    // These will be professional project preview images
    const imageUpdates = {
      'Wandarlog': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=400&fit=crop&auto=format',
      'Payment UI Component': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop&auto=format',
      'Web Food': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop&auto=format'
    };
    
    console.log('\\nUpdating project images...');
    for (const project of projects) {
      const newImageUrl = imageUpdates[project.title];
      if (newImageUrl) {
        await Project.findByIdAndUpdate(project._id, { imageUrl: newImageUrl });
        console.log(`✅ Updated ${project.title} with image: ${newImageUrl}`);
      }
    }
    
    console.log('\\n🎯 Project images updated successfully!');
    console.log('\\nNOTE: These are temporary placeholder images.');
    console.log('To add real screenshots:');
    console.log('1. Take screenshots of your live projects');
    console.log('2. Use the admin panel to upload real project images');
    console.log('3. Or manually replace imageUrl in the database');
    
  } catch (error) {
    console.error('❌ Error adding project images:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\\nDisconnected from MongoDB');
  }
};

addProjectImages();
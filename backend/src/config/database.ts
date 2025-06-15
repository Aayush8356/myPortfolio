import mongoose from 'mongoose';
import Project from '../models/Project';
import ContactDetails from '../models/ContactDetails';
import Contact from '../models/Contact';
import User from '../models/User';

export const createIndexes = async () => {
  try {
    console.log('Creating database indexes for better performance...');
    
    // Create indexes for Projects collection
    await Project.collection.createIndex({ createdAt: -1 });
    await Project.collection.createIndex({ featured: 1, createdAt: -1 });
    
    // Create indexes for Contact collection  
    await Contact.collection.createIndex({ createdAt: -1 });
    await Contact.collection.createIndex({ read: 1, createdAt: -1 });
    
    // Create indexes for User collection
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ username: 1 }, { unique: true });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.warn('Warning: Could not create database indexes:', error);
    // Don't throw error to prevent app startup failure
  }
};
import express from 'express';
import cors, { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { createIndexes } from './config/database';
import User from './models/User';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import contactRoutes from './routes/contact';
import contactDetailsRoutes from './routes/contactDetails';
import resumeRoutes from './routes/resume';
import heroRoutes from './routes/hero';
import aboutRoutes from './routes/about';
import funCentreRoutes from './routes/funCentre';
import proxyRoutes from './routes/proxy';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Restrictive CORS: allow only specific origins
const defaultProdOrigin = process.env.PRODUCTION_DOMAIN || 'https://meetaayush.com';
const additionalOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const allowedOrigins = (
  process.env.NODE_ENV === 'production'
    ? [defaultProdOrigin, ...additionalOrigins]
    : [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5002',
        ...additionalOrigins
      ]
).map(origin => origin.replace(/\/$/, '')); // normalize trailing slashes

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // non-browser or same-origin
    const normalized = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalized)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// Serve uploads directory with correct path for both dev and production
const uploadsPath = path.join(__dirname, '../uploads');
console.log('Uploads path:', uploadsPath);

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log('Created uploads directory');
}

// Serve uploads directory with correct path for both dev and production
app.use('/uploads', express.static(uploadsPath));


// Health check endpoint for cache warming
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/contact-details', contactDetailsRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/fun-centre', funCentreRoutes);

// Custom domain proxy routes (must be before catch-all routes)
app.use('/', proxyRoutes);



app.get('/', (req, res) => {
  res.json({ 
    message: 'Portfolio API is running!',
    version: '1.1.0',
    timestamp: new Date().toISOString(),
    status: 'healthy'
  });
});

// Health check endpoint for deployment verification
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '1.1.0'
  });
});

// Debug route to test uploads path
app.get('/debug/uploads', (req, res) => {
  const uploadsPath = path.join(__dirname, '../uploads');
  console.log('Debug uploads path:', uploadsPath);
  
  try {
    const files = fs.readdirSync(uploadsPath);
    res.json({
      uploadsPath,
      exists: fs.existsSync(uploadsPath),
      files: files,
      __dirname,
      cwd: process.cwd()
    });
  } catch (error) {
    res.json({
      uploadsPath,
      exists: fs.existsSync(uploadsPath),
      error: error instanceof Error ? error.message : 'Unknown error',
      __dirname,
      cwd: process.cwd()
    });
  }
});

// Auto-seed admin user function
const seedAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (!existingAdmin) {
      const admin = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        isAdmin: true
      });
      await admin.save();
      console.log('Admin user created: admin@example.com / admin123');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.warn('Warning: Could not seed admin user:', error);
  }
};

// Handle uncaught exceptions and rejections for deployment
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');
    
    // Create database indexes for better performance
    await createIndexes();
    
    // Seed admin user
    await seedAdminUser();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check available at: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
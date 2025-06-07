import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import contactRoutes from './routes/contact';
import contactDetailsRoutes from './routes/contactDetails';
import resumeRoutes from './routes/resume';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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


app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/contact-details', contactDetailsRoutes);
app.use('/api/resume', resumeRoutes);

// Domain proxy routes for resume
app.get('/resume-preview', (req, res) => {
  const resumePath = path.join(__dirname, '../uploads/resume.pdf');
  
  if (fs.existsSync(resumePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="Aayush_Gupta_Resume.pdf"');
    res.sendFile(resumePath);
  } else {
    res.status(404).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Resume Not Available</h1>
          <p>The resume file is currently not available. Please try again later.</p>
          <button onclick="window.close()">Close</button>
        </body>
      </html>
    `);
  }
});

app.get('/resume-download', (req, res) => {
  const resumePath = path.join(__dirname, '../uploads/resume.pdf');
  
  if (fs.existsSync(resumePath)) {
    res.download(resumePath, 'Aayush_Gupta_Resume.pdf', (err) => {
      if (err) {
        res.status(500).json({ message: 'Error downloading resume' });
      }
    });
  } else {
    res.status(404).json({ message: 'Resume not found' });
  }
});


app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running!' });
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

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
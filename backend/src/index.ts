import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
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
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/contact-details', contactDetailsRoutes);
app.use('/api/resume', resumeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running!' });
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
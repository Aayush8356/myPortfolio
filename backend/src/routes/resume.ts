import express from 'express';
import path from 'path';
import fs from 'fs';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { uploadResume } from '../middleware/upload';
import ContactDetails from '../models/ContactDetails';

const router = express.Router();

// Upload resume (admin only)
router.post('/upload', authenticateToken, requireAdmin, (req: AuthRequest, res) => {
  uploadResume.single('resume')(req, res, async (err) => {
    if (err) {
      if (err.message === 'Only PDF files are allowed for resume uploads' || 
          err.message === 'Only PDF files are allowed') {
        return res.status(400).json({ message: 'Only PDF files are allowed' });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too large. Maximum 5MB allowed.' });
      }
      return res.status(500).json({ message: 'File upload failed' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      // Update contact details with new resume URL
      let contactDetails = await ContactDetails.findOne();
      
      if (!contactDetails) {
        // Create default contact details if none exist
        contactDetails = new ContactDetails({
          email: 'your.email@example.com',
          phone: '+1 (555) 123-4567',
          location: 'Your City, Country',
          resume: '/uploads/resume.pdf'
        });
      } else {
        contactDetails.resume = '/uploads/resume.pdf';
      }
      
      await contactDetails.save();

      res.json({
        message: 'Resume uploaded successfully',
        filename: req.file.filename,
        resumeUrl: '/uploads/resume.pdf'
      });
    } catch (error) {
      console.error('Error updating contact details:', error);
      res.status(500).json({ message: 'Error updating resume URL' });
    }
  });
});

// Get current resume
router.get('/current', async (req, res) => {
  try {
    const resumePath = path.join(__dirname, '../../uploads/resume.pdf');
    
    if (fs.existsSync(resumePath)) {
      res.json({ 
        hasResume: true, 
        resumeUrl: '/uploads/resume.pdf',
        uploadedAt: fs.statSync(resumePath).mtime
      });
    } else {
      res.json({ 
        hasResume: false, 
        resumeUrl: null 
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking resume status' });
  }
});

// Download resume
router.get('/download', (req, res) => {
  const resumePath = path.join(__dirname, '../../uploads/resume.pdf');
  
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

// Delete resume (admin only)
router.delete('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const resumePath = path.join(__dirname, '../../uploads/resume.pdf');
    
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
      
      // Update contact details to remove resume URL
      const contactDetails = await ContactDetails.findOne();
      if (contactDetails) {
        contactDetails.resume = '';
        await contactDetails.save();
      }
      
      res.json({ message: 'Resume deleted successfully' });
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resume' });
  }
});

export default router;
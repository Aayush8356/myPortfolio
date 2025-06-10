import express from 'express';
import path from 'path';
import fs from 'fs';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { uploadResume } from '../middleware/upload';
import ContactDetails from '../models/ContactDetails';
import { put, del, head } from '@vercel/blob';

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
      let resumeUrl: string;

      if (process.env.NODE_ENV === 'production' && process.env.BLOB_READ_WRITE_TOKEN) {
        // Production: Use Vercel Blob
        const filename = `resume-${Date.now()}.pdf`;
        const blob = await put(filename, req.file.buffer, { 
          access: 'public',
          contentType: 'application/pdf'
        });
        resumeUrl = blob.url;
      } else {
        // Development: Use local storage
        const uploadsDir = path.join(__dirname, '../../uploads');
        const resumePath = path.join(uploadsDir, 'resume.pdf');
        
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        // Write file to local storage
        fs.writeFileSync(resumePath, req.file.buffer);
        resumeUrl = '/uploads/resume.pdf';
      }

      // Update contact details with new resume URL
      let contactDetails = await ContactDetails.findOne();
      
      if (!contactDetails) {
        // Create default contact details if none exist
        contactDetails = new ContactDetails({
          email: 'your.email@example.com',
          phone: '+1 (555) 123-4567',
          location: 'Your City, Country',
          resume: resumeUrl
        });
      } else {
        contactDetails.resume = resumeUrl;
      }
      
      await contactDetails.save();

      res.json({
        message: 'Resume uploaded successfully',
        filename: req.file.originalname,
        resumeUrl: resumeUrl
      });
    } catch (error) {
      console.error('Error uploading resume:', error);
      res.status(500).json({ message: 'Error uploading resume' });
    }
  });
});

// Get current resume
router.get('/current', async (req, res) => {
  try {
    // Check contact details for stored resume URL
    const contactDetails = await ContactDetails.findOne();
    
    if (contactDetails && contactDetails.resume) {
      // Check if it's a Vercel Blob URL (starts with https://)
      if (contactDetails.resume.startsWith('https://')) {
        // Verify the blob still exists
        try {
          await head(contactDetails.resume);
          res.json({ 
            hasResume: true, 
            resumeUrl: contactDetails.resume,
            uploadedAt: contactDetails.updatedAt
          });
          return;
        } catch (blobError) {
          console.warn('Blob URL no longer valid:', contactDetails.resume);
          // Continue to check local file
        }
      }
      
      // Check local file for development or fallback
      if (contactDetails.resume.startsWith('/uploads/')) {
        const resumePath = path.join(__dirname, '../../uploads/resume.pdf');
        
        if (fs.existsSync(resumePath)) {
          res.json({ 
            hasResume: true, 
            resumeUrl: contactDetails.resume,
            uploadedAt: fs.statSync(resumePath).mtime
          });
          return;
        }
      }
    }
    
    // No valid resume found
    res.json({ 
      hasResume: false, 
      resumeUrl: null 
    });
  } catch (error) {
    console.error('Error checking resume status:', error);
    res.status(500).json({ message: 'Error checking resume status' });
  }
});

// Preview resume (opens in browser)
router.get('/preview', async (req, res) => {
  try {
    const contactDetails = await ContactDetails.findOne();
    
    if (contactDetails && contactDetails.resume) {
      // If it's a Vercel Blob URL, redirect to it directly
      if (contactDetails.resume.startsWith('https://')) {
        return res.redirect(contactDetails.resume);
      }
      
      // If it's a local file path
      if (contactDetails.resume.startsWith('/uploads/')) {
        const resumePath = path.join(__dirname, '../../uploads/resume.pdf');
        
        if (fs.existsSync(resumePath)) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline; filename="Aayush_Gupta_Resume.pdf"');
          return res.sendFile(resumePath);
        }
      }
    }
    
    // No resume found
    res.status(404).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Resume Not Available</h1>
          <p>The resume file is currently not available. Please try again later.</p>
          <button onclick="window.close()">Close</button>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error previewing resume:', error);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Error</h1>
          <p>An error occurred while trying to preview the resume.</p>
          <button onclick="window.close()">Close</button>
        </body>
      </html>
    `);
  }
});

// Download resume
router.get('/download', async (req, res) => {
  try {
    const contactDetails = await ContactDetails.findOne();
    
    if (contactDetails && contactDetails.resume) {
      // If it's a Vercel Blob URL, redirect with download headers
      if (contactDetails.resume.startsWith('https://')) {
        res.setHeader('Content-Disposition', 'attachment; filename="Aayush_Gupta_Resume.pdf"');
        return res.redirect(contactDetails.resume);
      }
      
      // If it's a local file path
      if (contactDetails.resume.startsWith('/uploads/')) {
        const resumePath = path.join(__dirname, '../../uploads/resume.pdf');
        
        if (fs.existsSync(resumePath)) {
          return res.download(resumePath, 'Aayush_Gupta_Resume.pdf', (err) => {
            if (err) {
              res.status(500).json({ message: 'Error downloading resume' });
            }
          });
        }
      }
    }
    
    res.status(404).json({ message: 'Resume not found' });
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ message: 'Error downloading resume' });
  }
});

// Delete resume (admin only)
router.delete('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const contactDetails = await ContactDetails.findOne();
    
    if (contactDetails && contactDetails.resume) {
      // If it's a Vercel Blob URL, delete from blob storage
      if (contactDetails.resume.startsWith('https://')) {
        try {
          await del(contactDetails.resume);
        } catch (blobError) {
          console.warn('Error deleting blob:', blobError);
          // Continue to clear from database even if blob deletion fails
        }
      }
      
      // If it's a local file path, delete the local file
      if (contactDetails.resume.startsWith('/uploads/')) {
        const resumePath = path.join(__dirname, '../../uploads/resume.pdf');
        
        if (fs.existsSync(resumePath)) {
          fs.unlinkSync(resumePath);
        }
      }
      
      // Clear resume URL from database
      contactDetails.resume = '';
      await contactDetails.save();
      
      res.json({ message: 'Resume deleted successfully' });
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ message: 'Error deleting resume' });
  }
});

export default router;
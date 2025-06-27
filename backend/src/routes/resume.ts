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

      // Store internal blob URL but return custom domain URL
      let contactDetails = await ContactDetails.findOne();
      
      if (!contactDetails) {
        // Create default contact details if none exist
        contactDetails = new ContactDetails({
          email: 'your.email@example.com',
          phone: '+1 (555) 123-4567',
          location: 'Your City, Country',
          resume: resumeUrl, // Store the actual blob URL internally
          resumePublicUrl: `${process.env.PRODUCTION_DOMAIN || 'https://meetaayush.com'}/blob/resume` // Public URL for external access
        });
      } else {
        contactDetails.resume = resumeUrl; // Store the actual blob URL internally
        contactDetails.resumePublicUrl = `${process.env.PRODUCTION_DOMAIN || 'https://meetaayush.com'}/blob/resume`; // Public URL for external access
      }
      
      await contactDetails.save();

      res.json({
        message: 'Resume uploaded successfully',
        filename: req.file.originalname,
        resumeUrl: `${process.env.PRODUCTION_DOMAIN || 'https://meetaayush.com'}/blob/resume`, // Return custom domain URL
        downloadUrl: `${process.env.PRODUCTION_DOMAIN || 'https://meetaayush.com'}/api/resume/download` // Consistent download URL
      });
    } catch (error) {
      console.error('Error uploading resume:', error);
      res.status(500).json({ message: 'Error uploading resume' });
    }
  });
});

// Get current resume - optimized for performance
router.get('/current', async (req, res) => {
  try {
    // Quick database lookup with lean query
    const contactDetails = await ContactDetails.findOne().lean();
    
    if (contactDetails && contactDetails.resume) {
      // Trust the database record without external verification for speed
      // The actual preview/download endpoints will handle errors gracefully
      res.json({ 
        hasResume: true, 
        resumeUrl: contactDetails.resume,
        uploadedAt: contactDetails.updatedAt
      });
      return;
    }
    
    // No resume found
    res.json({ 
      hasResume: false, 
      resumeUrl: null 
    });
  } catch (error) {
    console.error('Error checking resume status:', error);
    res.status(500).json({ message: 'Error checking resume status' });
  }
});

// Preview resume (opens in browser) - optimized with caching
router.get('/preview', async (req, res) => {
  try {
    // Set cache headers for better performance
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes cache
    
    const contactDetails = await ContactDetails.findOne().lean();
    
    if (contactDetails && contactDetails.resume) {
      // If it's a Vercel Blob URL, redirect directly for better performance
      if (contactDetails.resume.startsWith('https://')) {
        try {
          // Test blob accessibility with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
          
          const response = await fetch(contactDetails.resume, { 
            method: 'HEAD',
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            // Redirect to blob URL for direct viewing
            return res.redirect(contactDetails.resume);
          }
        } catch (fetchError) {
          const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
          console.warn('Blob URL check failed, serving error page:', errorMessage);
        }
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
    
    // No resume found or error occurred
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

// Download resume - optimized with direct blob access
router.get('/download', async (req, res) => {
  try {
    const contactDetails = await ContactDetails.findOne().lean();
    
    if (contactDetails && contactDetails.resume) {
      // If it's a Vercel Blob URL, redirect for direct download
      if (contactDetails.resume.startsWith('https://')) {
        try {
          // Add download disposition to the URL redirect
          const downloadUrl = contactDetails.resume + '?download=1';
          return res.redirect(downloadUrl);
        } catch (fetchError) {
          console.error('Error with blob download redirect:', fetchError);
          // Fallback to fetch method
          try {
            const response = await fetch(contactDetails.resume);
            if (response.ok) {
              const buffer = await response.arrayBuffer();
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', 'attachment; filename="Aayush_Gupta_Resume.pdf"');
              return res.send(Buffer.from(buffer));
            }
          } catch (fallbackError) {
            console.error('Fallback download also failed:', fallbackError);
          }
        }
      }
      
      // If it's a local file path
      if (contactDetails.resume.startsWith('/uploads/')) {
        const resumePath = path.join(__dirname, '../../uploads/resume.pdf');
        
        if (fs.existsSync(resumePath)) {
          return res.download(resumePath, 'Aayush_Gupta_Resume.pdf', (err) => {
            if (err) {
              console.error('Local file download error:', err);
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
      if (contactDetails.resume.startsWith('https://') && process.env.BLOB_READ_WRITE_TOKEN) {
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

// Force clear invalid resume URL (admin only) - temporary debugging endpoint
router.delete('/clear-invalid', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const contactDetails = await ContactDetails.findOne();
    
    if (contactDetails) {
      console.log('Clearing invalid resume URL:', contactDetails.resume);
      contactDetails.resume = '';
      await contactDetails.save();
      res.json({ message: 'Resume URL cleared from database' });
    } else {
      res.json({ message: 'No contact details found' });
    }
  } catch (error) {
    console.error('Error clearing resume URL:', error);
    res.status(500).json({ message: 'Error clearing resume URL' });
  }
});

// Check environment configuration (admin only) - debugging endpoint
router.get('/env-check', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    res.json({
      nodeEnv: process.env.NODE_ENV,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      blobTokenPrefix: process.env.BLOB_READ_WRITE_TOKEN ? process.env.BLOB_READ_WRITE_TOKEN.substring(0, 20) + '...' : 'Not set'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking environment' });
  }
});

// Sync resume URL (admin only) - fixes production resume URL issue
router.post('/sync-url', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { resumeUrl } = req.body;
    
    if (!resumeUrl) {
      return res.status(400).json({ message: 'Resume URL is required' });
    }

    // Validate that it's a valid Vercel Blob URL
    if (!resumeUrl.startsWith('https://') || !resumeUrl.includes('blob.vercel-storage.com')) {
      return res.status(400).json({ message: 'Invalid Vercel Blob URL' });
    }

    // Verify the blob still exists by making a HEAD request
    try {
      const response = await fetch(resumeUrl, { method: 'HEAD' });
      if (!response.ok) {
        return res.status(400).json({ message: 'Resume URL is not accessible' });
      }
    } catch (fetchError) {
      return res.status(400).json({ message: 'Could not verify resume URL' });
    }

    // Update contact details with the resume URL
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
      message: 'Resume URL synced successfully',
      resumeUrl: resumeUrl,
      updatedAt: contactDetails.updatedAt
    });
  } catch (error) {
    console.error('Error syncing resume URL:', error);
    res.status(500).json({ message: 'Error syncing resume URL' });
  }
});

export default router;
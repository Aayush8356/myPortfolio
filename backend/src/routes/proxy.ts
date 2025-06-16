import express from 'express';
import { Request, Response } from 'express';
import ContactDetails from '../models/ContactDetails';

const router = express.Router();

// Proxy endpoint for blob storage
// This allows all blob URLs to use meetaayush.com domain instead of exposing Vercel Blob URLs
router.get('/blob/*', async (req: Request, res: Response) => {
  try {
    const blobPath = req.params[0]; // Get the path after /blob/
    
    if (!blobPath) {
      return res.status(400).json({ message: 'Blob path is required' });
    }

    // Handle resume requests
    if (blobPath === 'resume' || blobPath === 'resume.pdf') {
      try {
        const contactDetails = await ContactDetails.findOne().lean();
        
        if (contactDetails && contactDetails.resume) {
          // If it's a Vercel Blob URL, redirect directly
          if (contactDetails.resume.startsWith('https://')) {
            return res.redirect(contactDetails.resume);
          }
          
          // If it's a local file, redirect to the API endpoint
          if (contactDetails.resume.startsWith('/uploads/')) {
            return res.redirect('/api/resume/preview');
          }
        }
        
        return res.status(404).json({ message: 'Resume not found' });
      } catch (error) {
        console.error('Resume proxy error:', error);
        return res.redirect('/api/resume/preview'); // Fallback to API endpoint
      }
    }

    // Handle resume download requests
    if (blobPath === 'resume/download') {
      return res.redirect('/api/resume/download');
    }

    // For project images and other blobs, we need to look up the actual blob URL
    // This could be enhanced to cache blob URL mappings in the database
    
    // For now, return a helpful error for unmapped blob requests
    res.status(404).json({ 
      message: 'Blob not found',
      help: 'Use meetaayush.com/blob/resume for resume or project-specific endpoints'
    });

  } catch (error) {
    console.error('Blob proxy error:', error);
    res.status(500).json({ message: 'Proxy error' });
  }
});

// Proxy endpoint for project images
router.get('/assets/projects/:filename', async (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    
    // Redirect to the actual project image endpoint
    res.redirect(`/api/projects/images/${filename}`);
    
  } catch (error) {
    console.error('Assets proxy error:', error);
    res.status(500).json({ message: 'Asset proxy error' });
  }
});

// General assets proxy for future use
router.get('/assets/*', async (req: Request, res: Response) => {
  try {
    const assetPath = req.params[0];
    
    if (!assetPath) {
      return res.status(400).json({ message: 'Asset path is required' });
    }

    // Handle different asset types
    if (assetPath.startsWith('projects/')) {
      const filename = assetPath.replace('projects/', '');
      return res.redirect(`/api/projects/images/${filename}`);
    }

    res.status(404).json({ 
      message: 'Asset not found',
      path: assetPath
    });

  } catch (error) {
    console.error('Assets proxy error:', error);
    res.status(500).json({ message: 'Asset proxy error' });
  }
});

export default router;
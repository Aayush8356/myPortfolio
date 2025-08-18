import express from 'express';
import { Request, Response } from 'express';
import ContactDetails from '../models/ContactDetails';

const router = express.Router();

// Get the Render backend URL from environment variable
const RENDER_BACKEND_URL = process.env.RENDER_BACKEND_URL || 'https://your-backend.onrender.com';

// Proxy endpoint for blob storage
// This allows all blob URLs to use meetaayush.com domain instead of exposing Vercel Blob URLs
router.get('/blob/*', async (req: Request, res: Response) => {
  try {
    const blobPath = req.params[0]; // Get the path after /blob/
    
    if (!blobPath) {
      return res.status(400).json({ message: 'Blob path is required' });
    }

    // Handle resume requests - serve directly through custom domain
    if (blobPath === 'resume' || blobPath === 'resume.pdf') {
      // Avoid stale caching on resume preview through proxy
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      try {
        const contactDetails = await ContactDetails.findOne().lean();
        
        if (contactDetails && contactDetails.resume) {
          // If it's a Vercel Blob URL, fetch and serve through our domain
          if (contactDetails.resume.startsWith('https://')) {
            try {
              const response = await fetch(contactDetails.resume);
              
              if (response.ok) {
                const buffer = await response.arrayBuffer();
                
                // Serve PDF directly through our custom domain
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename="Aayush_Gupta_Resume.pdf"');
                res.setHeader('Content-Length', buffer.byteLength.toString());
                // Do not cache to ensure latest resume is served
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                
                return res.send(Buffer.from(buffer));
              }
            } catch (fetchError) {
              console.warn('Blob fetch failed in proxy:', fetchError);
            }
          }
          
          // If it's a local file, serve directly
          if (contactDetails.resume.startsWith('/uploads/')) {
            const path = require('path');
            const fs = require('fs');
            const resumePath = path.join(__dirname, '../../uploads/resume.pdf');
            
            if (fs.existsSync(resumePath)) {
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', 'inline; filename="Aayush_Gupta_Resume.pdf"');
              return res.sendFile(resumePath);
            }
          }
        }
        
        return res.status(404).json({ message: 'Resume not found' });
      } catch (error) {
        console.error('Resume proxy error:', error);
        return res.status(500).json({ message: 'Resume proxy error' });
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

// Note: API routes are handled directly by the main Express app
// No need to proxy API calls since this backend serves them directly

export default router;
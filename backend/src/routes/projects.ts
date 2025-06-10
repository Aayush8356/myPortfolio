import express, { Request, Response } from 'express';
import Project from '../models/Project';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { uploadProjectImage } from '../middleware/upload';
import { put, del } from '@vercel/blob';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/featured', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, technologies, imageUrl, githubUrl, liveUrl, featured } = req.body;

    const project = new Project({
      title,
      description,
      technologies,
      imageUrl,
      githubUrl,
      liveUrl,
      featured: featured || false
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, technologies, imageUrl, githubUrl, liveUrl, featured } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, technologies, imageUrl, githubUrl, liveUrl, featured },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete associated image if it exists
    if (project.imageUrl) {
      // If it's a Vercel Blob URL, delete from blob storage
      if (project.imageUrl.startsWith('https://')) {
        try {
          await del(project.imageUrl);
        } catch (blobError) {
          console.warn('Error deleting project image blob:', blobError);
        }
      }
      // If it's a local file path, delete the local file
      else if (project.imageUrl.startsWith('/projects/images/')) {
        const filename = project.imageUrl.split('/').pop();
        if (filename) {
          const imagePath = path.join(__dirname, '../../uploads/projects', filename);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Upload project image
router.post('/upload-image', authenticateToken, requireAdmin, uploadProjectImage.single('image'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    let imageUrl: string;
    let filename: string;

    if (process.env.NODE_ENV === 'production') {
      // Production: Use Vercel Blob
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(req.file.originalname).toLowerCase();
      filename = `project-${uniqueSuffix}${extension}`;
      
      const blob = await put(filename, req.file.buffer, { 
        access: 'public',
        contentType: req.file.mimetype
      });
      imageUrl = blob.url;
    } else {
      // Development: Use local storage
      const projectImagesDir = path.join(__dirname, '../../uploads/projects');
      
      // Ensure projects directory exists
      if (!fs.existsSync(projectImagesDir)) {
        fs.mkdirSync(projectImagesDir, { recursive: true });
      }
      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(req.file.originalname).toLowerCase();
      filename = `project-${uniqueSuffix}${extension}`;
      const imagePath = path.join(projectImagesDir, filename);
      
      // Write file to local storage
      fs.writeFileSync(imagePath, req.file.buffer);
      imageUrl = `/projects/images/${filename}`;
    }

    res.json({ 
      message: 'Image uploaded successfully',
      imageUrl,
      filename 
    });
  } catch (error) {
    console.error('Error uploading project image:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Serve project images
router.get('/images/:filename', (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../../uploads/projects', filename);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.sendFile(imagePath);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete project image
router.delete('/images/:filename', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, '../../uploads/projects', filename);
    
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
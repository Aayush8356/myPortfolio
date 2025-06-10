import express, { Request, Response } from 'express';
import Project from '../models/Project';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { uploadProjectImage } from '../middleware/upload';
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
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
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

    const imageUrl = `/api/projects/images/${req.file.filename}`;
    res.json({ 
      message: 'Image uploaded successfully',
      imageUrl,
      filename: req.file.filename 
    });
  } catch (error) {
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
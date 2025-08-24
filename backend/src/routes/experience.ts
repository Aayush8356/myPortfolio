
import express, { Request, Response } from 'express';
import Experience from '../models/Experience';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { WebhookTriggers } from '../utils/webhookService';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 }).lean();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const newExperience = new Experience(req.body);
    const savedExperience = await newExperience.save();
    WebhookTriggers.experienceCreated(savedExperience.id);
    res.status(201).json(savedExperience);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updatedExperience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExperience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    WebhookTriggers.experienceUpdated(updatedExperience.id);
    res.json(updatedExperience);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const deletedExperience = await Experience.findByIdAndDelete(req.params.id);
    if (!deletedExperience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    WebhookTriggers.experienceDeleted(req.params.id);
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;

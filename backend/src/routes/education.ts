
import express, { Request, Response } from 'express';
import Education from '../models/Education';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { WebhookTriggers } from '../utils/webhookService';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const educations = await Education.find().sort({ createdAt: -1 }).lean();
    res.json(educations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const newEducation = new Education(req.body);
    const savedEducation = await newEducation.save();
    WebhookTriggers.educationCreated(savedEducation._id.toString());
    res.status(201).json(savedEducation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const updatedEducation = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEducation) {
      return res.status(404).json({ message: 'Education not found' });
    }
    WebhookTriggers.educationUpdated(updatedEducation._id.toString());
    res.json(updatedEducation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const deletedEducation = await Education.findByIdAndDelete(req.params.id);
    if (!deletedEducation) {
      return res.status(404).json({ message: 'Education not found' });
    }
    WebhookTriggers.educationDeleted(req.params.id);
    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;

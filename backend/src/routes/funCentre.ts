import express, { Request, Response } from 'express';
import FunCentre from '../models/FunCentre';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { WebhookTriggers } from '../utils/webhookService';

const router = express.Router();

// Get Fun Centre settings (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    let funCentre = await FunCentre.findOne();
    
    if (!funCentre) {
      // Create default fun centre settings if none exist
      funCentre = new FunCentre({});
      await funCentre.save();
    }
    
    res.json(funCentre);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update Fun Centre settings (admin only)
router.put('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { enabled, title, description, games } = req.body;
    
    let funCentre = await FunCentre.findOne();
    
    if (!funCentre) {
      funCentre = new FunCentre({
        enabled,
        title,
        description,
        games
      });
    } else {
      funCentre.enabled = enabled;
      funCentre.title = title;
      funCentre.description = description;
      funCentre.games = games;
    }
    
    await funCentre.save();
    
    // Trigger Vercel rebuild (fire-and-forget)
    WebhookTriggers.funCentreUpdated();
    
    res.json(funCentre);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
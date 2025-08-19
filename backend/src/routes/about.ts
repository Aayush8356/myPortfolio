import express from 'express';
import About from '../models/About';
import { authenticateToken } from '../middleware/auth';
import { WebhookTriggers } from '../utils/webhookService';

const router = express.Router();

// Get about content
router.get('/', async (req, res) => {
  try {
    let about = await About.findOne();
    
    // If no about content exists, create default
    if (!about) {
      about = new About({});
      await about.save();
    }
    
    res.json(about);
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ message: 'Error fetching about content' });
  }
});

// Update about content
router.put('/', authenticateToken, async (req, res) => {
  try {
    const {
      backgroundTitle,
      backgroundContent,
      experienceTitle,
      experienceContent,
      skills,
      resumeDescription
    } = req.body;

    let about = await About.findOne();
    
    if (!about) {
      about = new About(req.body);
    } else {
      about.backgroundTitle = backgroundTitle;
      about.backgroundContent = backgroundContent;
      about.experienceTitle = experienceTitle;
      about.experienceContent = experienceContent;
      about.skills = skills;
      about.resumeDescription = resumeDescription;
    }
    
    await about.save();
    
    // Trigger Vercel rebuild (fire-and-forget)
    WebhookTriggers.aboutUpdated();
    
    res.json(about);
  } catch (error) {
    console.error('Error updating about content:', error);
    res.status(500).json({ message: 'Error updating about content' });
  }
});

export default router;
import express from 'express';
import Hero from '../models/Hero';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get hero content
router.get('/', async (req, res) => {
  try {
    let hero = await Hero.findOne();
    
    // If no hero content exists, create default
    if (!hero) {
      hero = new Hero({});
      await hero.save();
    }
    
    res.json(hero);
  } catch (error) {
    console.error('Error fetching hero content:', error);
    res.status(500).json({ message: 'Error fetching hero content' });
  }
});

// Update hero content
router.put('/', authenticateToken, async (req, res) => {
  try {
    const {
      greeting,
      name,
      title,
      description,
      primaryButtonText,
      secondaryButtonText,
      resumeButtonText
    } = req.body;

    let hero = await Hero.findOne();
    
    if (!hero) {
      hero = new Hero(req.body);
    } else {
      hero.greeting = greeting;
      hero.name = name;
      hero.title = title;
      hero.description = description;
      hero.primaryButtonText = primaryButtonText;
      hero.secondaryButtonText = secondaryButtonText;
      hero.resumeButtonText = resumeButtonText;
    }
    
    await hero.save();
    res.json(hero);
  } catch (error) {
    console.error('Error updating hero content:', error);
    res.status(500).json({ message: 'Error updating hero content' });
  }
});

export default router;
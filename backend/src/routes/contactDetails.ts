import express from 'express';
import ContactDetails from '../models/ContactDetails';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get contact details (public)
router.get('/', async (req, res) => {
  try {
    let contactDetails = await ContactDetails.findOne();
    
    // If no contact details exist, create default ones
    if (!contactDetails) {
      contactDetails = new ContactDetails({
        email: 'your.email@example.com',
        phone: '+1 (555) 123-4567',
        location: 'Your City, Country',
        linkedin: 'https://linkedin.com/in/yourprofile',
        github: 'https://github.com/yourusername',
        twitter: 'https://twitter.com/yourusername',
        resume: '/resume.pdf'
      });
      await contactDetails.save();
    }
    
    res.json(contactDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact details (admin only)
router.put('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { email, phone, location, linkedin, github, twitter, resume } = req.body;
    
    let contactDetails = await ContactDetails.findOne();
    
    if (!contactDetails) {
      contactDetails = new ContactDetails({
        email,
        phone,
        location,
        linkedin,
        github,
        twitter,
        resume
      });
    } else {
      contactDetails.email = email;
      contactDetails.phone = phone;
      contactDetails.location = location;
      contactDetails.linkedin = linkedin || '';
      contactDetails.github = github || '';
      contactDetails.twitter = twitter || '';
      contactDetails.resume = resume || '';
    }
    
    await contactDetails.save();
    res.json(contactDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
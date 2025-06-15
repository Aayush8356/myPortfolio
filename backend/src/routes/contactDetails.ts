import express from 'express';
import ContactDetails from '../models/ContactDetails';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get contact details (public) - optimized
router.get('/', async (req, res) => {
  try {
    // Add cache headers for better performance
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes cache
    
    let contactDetails = await ContactDetails.findOne().lean();
    
    // If no contact details exist, create default ones
    if (!contactDetails) {
      const newContactDetails = new ContactDetails({
        email: 'your.email@example.com',
        phone: '+1 (555) 123-4567',
        location: 'Your City, Country',
        linkedin: 'https://linkedin.com/in/yourprofile',
        github: 'https://github.com/yourusername',
        twitter: 'https://twitter.com/yourusername',
        resume: ''
      });
      await newContactDetails.save();
      // Fetch the saved document with lean() for consistent typing
      contactDetails = await ContactDetails.findOne().lean();
    }
    
    res.json(contactDetails);
  } catch (error) {
    console.error('Error fetching contact details:', error);
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
        resume: resume || ''
      });
    } else {
      contactDetails.email = email;
      contactDetails.phone = phone;
      contactDetails.location = location;
      contactDetails.linkedin = linkedin || '';
      contactDetails.github = github || '';
      contactDetails.twitter = twitter || '';
      // Only update resume if explicitly provided in request body, otherwise preserve existing value
      if (resume !== undefined) {
        contactDetails.resume = resume || '';
      }
      // If resume is not in request body at all, keep the existing resume value
    }
    
    await contactDetails.save();
    res.json(contactDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
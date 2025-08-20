import express, { Request, Response } from 'express';
import Contact from '../models/Contact';
import ContactDetails from '../models/ContactDetails';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import emailService from '../services/emailService';
import { WebhookTriggers } from '../utils/webhookService';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'All fields (name, email, message) are required' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please enter a valid email address' 
      });
    }

    // Save to database first
    const contact = new Contact({
      name,
      email,
      message
    });

    await contact.save();

    const contactDetails = await ContactDetails.findOne().lean();

    // Send email if environment variables are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
      const emailSent = await emailService.sendContactEmail({ name, email, message }, contactDetails);
      
      if (emailSent) {
        res.status(201).json({ 
          message: 'Message sent successfully! You should receive a confirmation email shortly.',
          emailSent: true
        });
      } else {
        res.status(201).json({ 
          message: 'Message saved successfully, but email notification failed. I will still see your message through the admin panel.',
          emailSent: false
        });
      }
    } else {
      // Fallback when email is not configured
      res.status(201).json({ 
        message: 'Message saved successfully! I will get back to you soon.',
        emailSent: false
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      message: 'Sorry, there was an error sending your message. Please try again or contact me directly.',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

router.get('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id/read', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    // Trigger Vercel rebuild (fire-and-forget) - contact message deletion might affect admin data
    WebhookTriggers.contactMessageDeleted(req.params.id);
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, FileText } from 'lucide-react';
import { API_BASE_URL, BLOB_BASE_URL, PRODUCTION_DOMAIN } from '../config/api';
import { cachedFetch } from '../lib/cache';
import { ContactSkeleton } from './ui/skeleton';

interface ContactDetails {
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  resume?: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    email: 'aayush@meetaayush.com',
    phone: '+1 (555) 123-4567',
    location: 'India',
    linkedin: 'https://linkedin.com/in/aayush-gupta',
    github: 'https://github.com/Aayush8356',
    twitter: '',
    resume: ''
  });
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  // Remove unused loading states since we show defaults immediately
  // const [contactLoading, setContactLoading] = useState(false);
  // const [contactError, setContactError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data immediately - no artificial delay
    Promise.all([fetchContactDetails(), checkResumeStatus()]);
  }, []);

  const fetchContactDetails = async () => {
    try {
      // Don't set loading state - show defaults immediately
      
      // Use consistent cache key and aggressive caching for contact details (15 minutes)
      const data = await cachedFetch<ContactDetails>(
        `${API_BASE_URL}/contact-details`,
        {},
        'contact-details', // Consistent with pre-cache
        900 // 15 minute cache
      );
      
      setContactDetails(prev => ({ ...prev, ...data })); // Merge with defaults
    } catch (error) {
      console.error('Error fetching contact details:', error);
      
      // Keep using default contact info - no error message to user
    }
  };

  const checkResumeStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/current`);
      if (response.ok) {
        const data = await response.json();
        setHasUploadedResume(data.hasResume);
      }
    } catch (error) {
      console.error('Error checking resume status:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Basic frontend validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all fields.');
      setLoading(false);
      setTimeout(() => setError(''), 5000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      setTimeout(() => setError(''), 5000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        
        // Show different success messages based on email status
        if (data.emailSent) {
          setError(''); // Clear any previous errors
        } else {
          // Still successful but email wasn't sent
          console.log('Message saved but email not sent:', data.message);
        }
        
        setTimeout(() => setSuccess(false), 8000); // Show success longer
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to send message. Please check your connection and try again.');
      }
      setTimeout(() => setError(''), 8000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-responsive-4xl font-display font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced animate-fade-in-up">
          <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-300% animate-gradient-x">
            CONTACT ME
          </span>
        </h2>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          <Card className="bg-dark-card/80 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-500 shadow-xl hover:shadow-2xl rounded-2xl border border-border/20 hover:border-primary/40 transform hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <CardHeader className="pb-6">
              <CardTitle className="text-foreground uppercase-spaced text-responsive-xl font-semibold">
                CONTACT INFO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {false ? (
                <ContactSkeleton />
              ) : (
                <>
                  {/* Remove error display - use graceful fallbacks instead */}
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 contact-icon-email flex-shrink-0" />
                    <a href={`mailto:${contactDetails.email}`} className="text-muted-foreground hover:text-accent transition-colors text-sm md:text-base break-all">
                      {contactDetails.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 contact-icon-phone flex-shrink-0" />
                    <a href={`tel:${contactDetails.phone}`} className="text-muted-foreground hover:text-accent transition-colors text-sm md:text-base">
                      {contactDetails.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 contact-icon-location flex-shrink-0" />
                    <span className="text-muted-foreground text-sm md:text-base">{contactDetails.location}</span>
                  </div>
                </>
              )}
              
              {/* Social Links */}
              <div className="pt-4">
                <div className="flex space-x-4 mb-4">
                  {contactDetails.linkedin && (
                    <a href={contactDetails.linkedin} target="_blank" rel="noopener noreferrer" 
                       className="text-muted-foreground social-linkedin hover-lift">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {contactDetails.github && (
                    <a href={contactDetails.github} target="_blank" rel="noopener noreferrer"
                       className="text-muted-foreground social-github hover-lift">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {contactDetails.twitter && (
                    <a href={contactDetails.twitter} target="_blank" rel="noopener noreferrer"
                       className="text-muted-foreground social-twitter hover-lift">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {(hasUploadedResume || contactDetails.resume) && (
                    <a 
                      href={`${PRODUCTION_DOMAIN}/blob/resume`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground contact-icon-default hover-lift"
                      title="View Resume"
                    >
                      <FileText className="w-5 h-5" />
                    </a>
                  )}
                </div>
                <p className="text-muted-foreground">
                  I'm always interested in new opportunities and exciting projects. 
                  Whether you have a question or just want to say hi, feel free to reach out!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-card/80 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-500 shadow-xl hover:shadow-2xl rounded-2xl border border-border/20 hover:border-primary/40 transform hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <CardHeader className="pb-6">
              <CardTitle className="text-foreground uppercase-spaced text-responsive-xl font-semibold">
                SEND ME A MESSAGE
              </CardTitle>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-md">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <div>
                      <p className="font-semibold">Message sent successfully!</p>
                      <p className="text-sm mt-1">You should receive a confirmation email shortly. I'll get back to you within 24-48 hours.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-md">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-responsive-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 sm:py-4 border border-border/20 bg-muted/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary/50 transition-all duration-300 text-responsive-base"
                    placeholder="Your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-responsive-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 sm:py-4 border border-border/20 bg-muted/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary/50 transition-all duration-300 text-responsive-base"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-responsive-sm font-medium text-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 sm:py-4 border border-border/20 bg-muted/50 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary hover:border-primary/50 transition-all duration-300 resize-none text-responsive-base min-h-[120px]"
                    placeholder="Your message..."
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 py-3 sm:py-4 text-responsive-base font-semibold tap-target"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
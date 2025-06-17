import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, FileText } from 'lucide-react';
import { API_BASE_URL, BLOB_BASE_URL } from '../config/api';
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
  const [contactLoading, setContactLoading] = useState(false); // Show defaults immediately
  const [contactError, setContactError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchContactDetails(), checkResumeStatus()]);
  }, []);

  const fetchContactDetails = async () => {
    try {
      // Don't set loading state - show defaults immediately
      setContactError(null);
      
      // Use aggressive caching for contact details (15 minutes)
      const data = await cachedFetch<ContactDetails>(
        `${API_BASE_URL}/contact-details`,
        {},
        'contact-details',
        900 // 15 minute cache
      );
      
      setContactDetails(data);
    } catch (error) {
      console.error('Error fetching contact details:', error);
      
      // Keep using default contact info - no error message to user
      setContactError(null); // Don't show error to user
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

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please check your connection and try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 text-gradient uppercase-spaced">CONTACT ME</h2>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
          <Card className="bg-dark-card backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-lg" style={{border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 0 15px rgba(59, 130, 246, 0.1)'}}>
            <CardHeader className="pb-6">
              <CardTitle className="text-foreground uppercase-spaced text-lg md:text-xl lg:text-2xl font-semibold">
                CONTACT INFO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {contactLoading ? (
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
                      href={hasUploadedResume ? `${BLOB_BASE_URL}/resume` : contactDetails.resume} 
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

          <Card className="bg-dark-card backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-lg" style={{border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 0 15px rgba(59, 130, 246, 0.1)'}}>
            <CardHeader className="pb-6">
              <CardTitle className="text-foreground uppercase-spaced text-lg md:text-xl lg:text-2xl font-semibold">
                SEND ME A MESSAGE
              </CardTitle>
            </CardHeader>
            <CardContent>
              {success && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-md">
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 rounded-md">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-dark bg-muted/50 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-dark bg-muted/50 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-dark bg-muted/50 backdrop-blur-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none"
                    placeholder="Your message..."
                  />
                </div>
                
                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-dark hover-lift">
                  {loading ? (
                    'Sending...'
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
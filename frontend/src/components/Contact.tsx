import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, FileText } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

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
    email: 'your.email@example.com',
    phone: '+1 (555) 123-4567',
    location: 'Your City, Country',
    linkedin: '',
    github: '',
    twitter: '',
    resume: ''
  });

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const fetchContactDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact-details`);
      if (response.ok) {
        const data = await response.json();
        setContactDetails(data);
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
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
    <section id="contact" className="py-20 bg-background relative">
      <div className="absolute inset-0 dark-grid opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient uppercase-spaced">CONTACT ME</h2>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="bg-dark-card backdrop-blur-sm shadow-dark">
            <CardHeader>
              <CardTitle className="text-foreground uppercase-spaced">CONTACT INFO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent" />
                <a href={`mailto:${contactDetails.email}`} className="text-muted-foreground hover:text-accent transition-colors">
                  {contactDetails.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent" />
                <a href={`tel:${contactDetails.phone}`} className="text-muted-foreground hover:text-accent transition-colors">
                  {contactDetails.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-accent" />
                <span className="text-muted-foreground">{contactDetails.location}</span>
              </div>
              
              {/* Social Links */}
              <div className="pt-4">
                <div className="flex space-x-4 mb-4">
                  {contactDetails.linkedin && (
                    <a href={contactDetails.linkedin} target="_blank" rel="noopener noreferrer" 
                       className="text-muted-foreground hover:text-accent transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {contactDetails.github && (
                    <a href={contactDetails.github} target="_blank" rel="noopener noreferrer"
                       className="text-muted-foreground hover:text-accent transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {contactDetails.twitter && (
                    <a href={contactDetails.twitter} target="_blank" rel="noopener noreferrer"
                       className="text-muted-foreground hover:text-accent transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {contactDetails.resume && (
                    <a href={contactDetails.resume} target="_blank" rel="noopener noreferrer"
                       className="text-muted-foreground hover:text-accent transition-colors">
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

          <Card className="bg-dark-card backdrop-blur-sm shadow-dark">
            <CardHeader>
              <CardTitle className="text-foreground uppercase-spaced">Send Me a Message</CardTitle>
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
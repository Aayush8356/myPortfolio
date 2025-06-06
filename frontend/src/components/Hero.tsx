import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
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

const Hero: React.FC = () => {
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    email: '',
    phone: '',
    location: '',
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadResume = () => {
    if (contactDetails.resume) {
      // If resume is uploaded via admin panel
      window.open(`${API_BASE_URL}/resume/download`, '_blank');
    } else {
      // Fallback to static resume
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-background dark-grid relative overflow-hidden">
      <div className="absolute inset-0 dark-gradient opacity-50"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient uppercase-spaced">
            FULL STACK
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-foreground uppercase-spaced">
            DEVELOPER
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Creating <span className="text-foreground font-semibold">modern web applications</span> with cutting-edge technologies.
            Passionate about <span className="text-accent font-semibold">clean code</span>, user experience, and <span className="text-primary font-semibold">innovative solutions</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-dark hover-lift uppercase-spaced"
            >
              View My Work
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto border-dark text-foreground hover:bg-muted hover-lift uppercase-spaced"
            >
              Get In Touch
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={downloadResume}
              className="w-full sm:w-auto border-dark text-foreground hover:bg-muted hover-lift uppercase-spaced"
            >
              <Download className="w-4 h-4 mr-2" />
              Resume
            </Button>
          </div>

          <div className="flex justify-center space-x-8">
            {contactDetails.github && (
              <a
                href={contactDetails.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 animate-subtle-float hover-lift"
              >
                <Github className="w-8 h-8" />
              </a>
            )}
            {contactDetails.linkedin && (
              <a
                href={contactDetails.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 animate-subtle-float hover-lift"
                style={{ animationDelay: '0.5s' }}
              >
                <Linkedin className="w-8 h-8" />
              </a>
            )}
            <button
              onClick={() => scrollToSection('contact')}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 animate-subtle-float hover-lift"
              style={{ animationDelay: '1s' }}
            >
              <Mail className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
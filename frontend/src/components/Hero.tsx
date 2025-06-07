import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Github, Linkedin, Mail, Download, Eye } from 'lucide-react';
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
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [currentText, setCurrentText] = useState(0);

  const texts = ['AAYUSH GUPTA', 'FULL STACK DEVELOPER'];

  useEffect(() => {
    fetchContactDetails();
    checkResumeStatus();
    // Check resume status periodically
    const resumeInterval = setInterval(checkResumeStatus, 30000);
    return () => clearInterval(resumeInterval);
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(textInterval);
  }, [texts.length]);

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

  const checkResumeStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/resume/current`);
      if (response.ok) {
        const data = await response.json();
        setHasUploadedResume(data.hasResume);
      } else {
        console.warn('Resume status check failed, falling back to static resume');
        setHasUploadedResume(false);
      }
    } catch (error) {
      console.error('Error checking resume status:', error);
      setHasUploadedResume(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadResume = async () => {
    // Recheck status before downloading to ensure we have the latest state
    await checkResumeStatus();
    
    if (hasUploadedResume) {
      // Use API route for download
      window.open('/api/resume/download', '_blank');
    } else {
      // Fallback to static resume in public folder
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.download = 'Aayush_Gupta_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const previewResume = async () => {
    // Recheck status before previewing to ensure we have the latest state
    await checkResumeStatus();
    
    if (hasUploadedResume) {
      // Use API route for preview
      window.open('/api/resume/preview', '_blank');
    } else {
      // Fallback to static resume in public folder
      window.open('/resume.pdf', '_blank');
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-background dark-grid relative overflow-hidden">
      <div className="absolute inset-0 dark-gradient opacity-50"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <p className="text-lg md:text-xl text-muted-foreground mb-4 animate-fade-in">Hi, I'm</p>
            <div className="h-16 md:h-20 flex items-center justify-center overflow-hidden">
              <h1 className={`text-2xl md:text-4xl lg:text-5xl font-bold uppercase-spaced transition-all duration-700 ease-in-out transform ${
                currentText === 0 
                  ? 'text-foreground translate-y-0 opacity-100' 
                  : currentText === 1 
                  ? 'text-gradient translate-y-0 opacity-100' 
                  : 'translate-y-full opacity-0'
              }`}>
                {texts[currentText]}
              </h1>
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up-delayed-3">
              Creating <span className="text-foreground font-semibold">modern web applications</span> with cutting-edge technologies.
              Passionate about <span className="text-primary font-semibold">clean code</span>, user experience, and <span className="text-primary font-semibold">innovative solutions</span>.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-slide-up-delayed-4">
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

          <div className="flex justify-center space-x-8 animate-slide-up-delayed-5">
            {contactDetails.github && (
              <a
                href={contactDetails.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover-lift transform hover:scale-110"
              >
                <Github className="w-8 h-8" />
              </a>
            )}
            {contactDetails.linkedin && (
              <a
                href={contactDetails.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover-lift transform hover:scale-110"
              >
                <Linkedin className="w-8 h-8" />
              </a>
            )}
            <button
              onClick={() => scrollToSection('contact')}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover-lift transform hover:scale-110"
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
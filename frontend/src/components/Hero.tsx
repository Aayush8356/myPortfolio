import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { HeroSkeleton } from './ui/skeleton';
import { cachedFetch } from '../lib/cache';

interface ContactDetails {
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  resume?: string;
}

interface HeroContent {
  greeting: string;
  name: string;
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  resumeButtonText: string;
}

const Hero: React.FC = () => {
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
  const [heroContent, setHeroContent] = useState<HeroContent>({
    greeting: "Hi, I'm",
    name: 'AAYUSH GUPTA',
    title: 'FULL STACK DEVELOPER',
    description: "Creating modern web applications with cutting-edge technologies. Passionate about clean code, user experience, and innovative solutions.",
    primaryButtonText: 'View My Work',
    secondaryButtonText: 'Get In Touch',
    resumeButtonText: 'Resume'
  });

  useEffect(() => {
    // Fetch data immediately - no artificial delay
    fetchContactDetails();
    fetchHeroContent();
    checkResumeStatus();
    
    // Check resume status periodically
    const resumeInterval = setInterval(checkResumeStatus, 30000);
    
    return () => {
      clearInterval(resumeInterval);
    };
  }, []);


  const fetchContactDetails = async () => {
    try {
      // Don't set loading state - show defaults immediately
      // Use consistent caching with Contact component
      const data = await cachedFetch<ContactDetails>(
        `${API_BASE_URL}/contact-details`,
        {},
        'contact-details', // Consistent with pre-cache and Contact component
        900 // 15 minute cache
      );
      setContactDetails(prev => ({ ...prev, ...data })); // Merge with defaults
    } catch (error) {
      console.error('Error fetching contact details:', error);
      // Keep using default contact details - no loading state needed
    }
  };

  const fetchHeroContent = async () => {
    try {
      // Don't set loading state - show defaults immediately
      // Use consistent caching with pre-cache
      const data = await cachedFetch<HeroContent>(
        `${API_BASE_URL}/hero`,
        {},
        'hero-content', // Consistent with pre-cache
        900 // 15 minute cache
      );
      setHeroContent(prev => ({ ...prev, ...data })); // Merge with defaults
    } catch (error) {
      console.error('Error fetching hero content:', error);
      // Keep using default hero content - no loading state needed
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
      // Direct backend URL - this works reliably
      window.open(`${API_BASE_URL}/resume/download`, '_blank');
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


  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden pt-16 md:pt-0">
      {/* Magical Background Effects */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="absolute inset-0 animated-grid opacity-40"></div>
      <div className="hero-spotlight"></div>
      <div className="floating-shapes"></div>
      <div className="code-rain"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Always show Hero content immediately - no skeleton needed */}
          {false ? (
            <HeroSkeleton />
          ) : (
            <>
              
          <div className="mb-6">
            <p className="text-lg text-muted-foreground mb-4">{heroContent.greeting}</p>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                {heroContent.name}
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary">
                {heroContent.title}
              </h2>
            </div>
          </div>
          <div>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {heroContent.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 md:mb-12 px-4 sm:px-0">
            <Button
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 btn-ripple"
            >
              {heroContent.primaryButtonText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto border-primary hover:border-primary/70 text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 btn-ripple"
            >
              {heroContent.secondaryButtonText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={downloadResume}
              className="w-full sm:w-auto border-accent hover:border-accent/70 text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 btn-ripple"
            >
              <Download className="w-4 h-4 mr-2" />
              {heroContent.resumeButtonText}
            </Button>
          </div>

          <div className="flex justify-center space-x-6">
            {contactDetails.github && (
              <a
                href={contactDetails.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <Github className="w-6 h-6" />
              </a>
            )}
            {contactDetails.linkedin && (
              <a
                href={contactDetails.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            )}
            <button
              onClick={() => scrollToSection('contact')}
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <Mail className="w-6 h-6" />
            </button>
          </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
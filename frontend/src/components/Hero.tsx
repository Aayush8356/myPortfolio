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
  const [heroContent, setHeroContent] = useState<HeroContent>({
    greeting: "Hi, I'm",
    name: 'AAYUSH GUPTA',
    title: 'FULL STACK DEVELOPER',
    description: "Creating modern web applications with cutting-edge technologies. Passionate about clean code, user experience, and innovative solutions.",
    primaryButtonText: 'View My Work',
    secondaryButtonText: 'Get In Touch',
    resumeButtonText: 'Resume'
  });
  
  // Loading states - Hero should show immediately with defaults
  // Remove unused loading states since we show defaults immediately
  // const [isLoadingHero, setIsLoadingHero] = useState(false);
  // const [isLoadingContact, setIsLoadingContact] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(true); // Only resume needs loading state

  const texts = [heroContent.name, heroContent.title];

  useEffect(() => {
    // Small delay to allow pre-cache to complete first
    const timer = setTimeout(() => {
      fetchContactDetails();
      fetchHeroContent();
      checkResumeStatus();
    }, 100); // 100ms delay to let pre-cache finish first
    
    // Check resume status periodically
    const resumeInterval = setInterval(checkResumeStatus, 30000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(resumeInterval);
    };
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(textInterval);
  }, [texts.length]);

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
      setContactDetails(data);
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
      setHeroContent(data);
    } catch (error) {
      console.error('Error fetching hero content:', error);
      // Keep using default hero content - no loading state needed
    }
  };

  const checkResumeStatus = async () => {
    try {
      setIsLoadingResume(true);
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
    } finally {
      setIsLoadingResume(false);
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
      {/* Tech Background Grid */}
      <div className="absolute inset-0 tech-grid opacity-30"></div>
      
      {/* Code Pattern Overlay */}
      <div className="absolute inset-0 code-pattern opacity-20"></div>
      
      {/* Circuit Pattern */}
      <div className="absolute inset-0 tech-circuit opacity-25"></div>
      
      {/* Dynamic Light Gradients */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        {/* Primary tech blue light */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-primary/30 dark:from-primary/40 via-primary/10 dark:via-primary/20 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Secondary golden light */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-secondary/25 dark:from-secondary/35 via-secondary/8 dark:via-secondary/15 to-transparent rounded-full blur-3xl animate-float-nebula"></div>
        
        {/* Accent mint light */}
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-radial from-accent/20 dark:from-accent/30 via-accent/5 dark:via-accent/10 to-transparent rounded-full blur-3xl animate-glow-pulse"></div>
        
        {/* Moving spotlight effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-conic from-primary/5 dark:from-primary/10 via-transparent to-secondary/5 dark:to-secondary/10 animate-spin-slow opacity-30 dark:opacity-50"></div>
      </div>
      
      {/* Tech Objects */}
      <div className="absolute inset-0 tech-objects pointer-events-none"></div>
      
      {/* Terminal Window */}
      <div className="terminal-window pointer-events-none"></div>
      
      {/* API Connection Line */}
      <div className="api-connection pointer-events-none"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
      
      {/* Sweeping light beam */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="light-beam"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Always show Hero content immediately - no skeleton needed */}
          {false ? (
            <HeroSkeleton />
          ) : (
            <>
              
          <div className="mb-4 md:mb-6">
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-2 md:mb-4 animate-fade-in dark:glow-text-secondary">{heroContent.greeting}</p>
            <div className="h-12 md:h-16 lg:h-20 flex items-center justify-center overflow-hidden">
              <h1 className={`text-xl md:text-2xl lg:text-4xl xl:text-5xl font-bold uppercase-spaced transition-all duration-700 ease-in-out transform ${
                currentText === 0 
                  ? 'text-foreground translate-y-0 opacity-100 dark:glow-text-primary' 
                  : currentText === 1 
                  ? 'text-primary translate-y-0 opacity-100 dark:glow-text-accent dark:animate-glow-pulse' 
                  : 'translate-y-full opacity-0'
              }`}>
                {texts[currentText]}
              </h1>
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm md:text-lg lg:text-xl xl:text-2xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up-delayed-3 px-2 md:px-0">
              {heroContent.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 lg:gap-6 justify-center items-center mb-8 md:mb-12 animate-slide-up-delayed-4 px-4 sm:px-0">
            <Button
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl dark:glow-primary dark:hover:glow-accent transition-all duration-300 uppercase-spaced text-xs md:text-sm dark:animate-float-nebula"
            >
              {heroContent.primaryButtonText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto border-primary/20 hover:border-secondary text-foreground hover:text-secondary hover:bg-secondary/10 dark:border-glow dark:hover:glow-secondary transition-all duration-300 uppercase-spaced text-xs md:text-sm"
            >
              {heroContent.secondaryButtonText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={downloadResume}
              className="w-full sm:w-auto border-accent/20 hover:border-accent text-foreground hover:text-accent hover:bg-accent/10 dark:border-glow dark:hover:glow-accent transition-all duration-300 uppercase-spaced text-xs md:text-sm"
            >
              <Download className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              {heroContent.resumeButtonText}
            </Button>
          </div>

          <div className="flex justify-center space-x-4 md:space-x-6 lg:space-x-8 animate-slide-up-delayed-5">
            {contactDetails.github && (
              <a
                href={contactDetails.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground social-github hover-lift"
              >
                <Github className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
              </a>
            )}
            {contactDetails.linkedin && (
              <a
                href={contactDetails.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground social-linkedin hover-lift"
              >
                <Linkedin className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
              </a>
            )}
            <button
              onClick={() => scrollToSection('contact')}
              className="text-muted-foreground social-email hover-lift"
            >
              <Mail className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
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
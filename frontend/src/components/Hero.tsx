import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Github, Linkedin, Mail, Download } from 'lucide-react';
import { API_BASE_URL, BLOB_BASE_URL } from '../config/api';
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
        // Resume status check failed, falling back to static resume
        setHasUploadedResume(false);
      }
    } catch (error) {
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
    const ts = Date.now();
    window.open(`${BLOB_BASE_URL}/resume/download?cb=${ts}`, '_blank');
  };

  // Premium particle animation system
  const particlesRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesArray = useRef<any[]>([]);
  
  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle system with mobile optimization
    class Particle {
      x: number;
      y: number;
      directionX: number;
      directionY: number;
      size: number;
      color: string;
      opacity: number;
      
      constructor() {
        this.x = Math.random() * (canvas?.width || 800);
        this.y = Math.random() * (canvas?.height || 600);
        this.directionX = (Math.random() * 2) - 1;
        this.directionY = (Math.random() * 2) - 1;
        // Smaller particles on mobile for better performance
        this.size = Math.random() * (window.innerWidth < 768 ? 2 : 3) + 1;
        this.color = Math.random() > 0.5 ? '#22c55e' : '#3b82f6';
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        if (!canvas) return;
        
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
          this.directionY = -this.directionY;
        }
        
        this.x += this.directionX * 0.5;
        this.y += this.directionY * 0.5;
        
        // Mouse interaction
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          this.x -= (dx / distance) * force * 2;
          this.y -= (dy / distance) * force * 2;
        }
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    
    // Initialize particles with mobile optimization
    const initParticles = () => {
      if (!canvas) return;
      
      particlesArray.current = [];
      // Reduce particle count on mobile for better performance
      const isMobile = window.innerWidth < 768;
      const divisor = isMobile ? 25000 : 15000;
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / divisor);
      
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.current.push(new Particle());
      }
    };
    
    // Connect particles with lines
    const connectParticles = () => {
      if (!ctx) return;
      
      for (let a = 0; a < particlesArray.current.length; a++) {
        for (let b = a; b < particlesArray.current.length; b++) {
          const dx = particlesArray.current[a].x - particlesArray.current[b].x;
          const dy = particlesArray.current[a].y - particlesArray.current[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const opacity = (120 - distance) / 120 * 0.3;
            ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray.current[a].x, particlesArray.current[a].y);
            ctx.lineTo(particlesArray.current[b].x, particlesArray.current[b].y);
            ctx.stroke();
          }
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesArray.current.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      connectParticles();
      requestAnimationFrame(animate);
    };
    
    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    initParticles();
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden pt-16 md:pt-0">
      {/* Premium Animated Particle Background */}
      <canvas 
        ref={particlesRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ background: 'transparent' }}
      />
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="absolute inset-0 animated-grid opacity-20"></div>
      <div className="hero-spotlight"></div>
      <div className="floating-shapes"></div>
      
      {/* Premium Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-6xl mx-auto py-12 md:py-16 lg:py-20">
          {/* Always show Hero content immediately - no skeleton needed */}
          {false ? (
            <HeroSkeleton />
          ) : (
            <>
              
          <div className="mb-8 md:mb-12">
            <p className="text-xl md:text-2xl text-muted-foreground mb-6 md:mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>{heroContent.greeting}</p>
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground animate-fade-in-up tracking-tight" style={{animationDelay: '0.4s'}}>
                <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-300% animate-gradient-x">
                  {heroContent.name}
                </span>
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent bg-300% animate-gradient-x">
                  {heroContent.title}
                </span>
              </h2>
            </div>
          </div>
          <div className="mb-10 md:mb-16">
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              {heroContent.description}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-12 md:mb-16 px-4 sm:px-0 animate-fade-in-up" style={{animationDelay: '1s'}}>
            <Button
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 btn-ripple transform hover:scale-105 hover:-translate-y-1"
            >
              {heroContent.primaryButtonText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto border-primary hover:border-primary/70 text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 btn-ripple transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
            >
              {heroContent.secondaryButtonText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={downloadResume}
              className="w-full sm:w-auto border-accent hover:border-accent/70 text-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 btn-ripple transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              {heroContent.resumeButtonText}
            </Button>
          </div>

          <div className="flex justify-center space-x-8 md:space-x-10 animate-fade-in-up" style={{animationDelay: '1.2s'}}>
            {contactDetails.github && (
              <a
                href={contactDetails.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 p-2 rounded-full hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/25"
              >
                <Github className="w-7 h-7 md:w-8 md:h-8" />
              </a>
            )}
            {contactDetails.linkedin && (
              <a
                href={contactDetails.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 p-2 rounded-full hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/25"
              >
                <Linkedin className="w-7 h-7 md:w-8 md:h-8" />
              </a>
            )}
            <button
              onClick={() => scrollToSection('contact')}
              className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 p-2 rounded-full hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/25"
            >
              <Mail className="w-7 h-7 md:w-8 md:h-8" />
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
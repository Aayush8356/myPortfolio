import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [heroContent, setHeroContent] = useState({ name: 'AAYUSH GUPTA' });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchHeroContent();
    
    // Add scroll listener for navbar hide/show and styling with throttling
    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Throttle scroll events for better performance
      const newTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const scrollDifference = Math.abs(currentScrollY - lastScrollY);
        
        // Update scroll state for styling
        setIsScrolled(currentScrollY > 50);
        
        // Only process if scroll difference is significant (reduces jitter)
        if (scrollDifference > 5) {
          // Hide/show navbar logic
          if (currentScrollY < 10) {
            // Always show at top
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 150) {
            // Scrolling down and past threshold - hide navbar with delay
            setTimeout(() => setIsVisible(false), 100);
            setIsMenuOpen(false); // Close mobile menu when hiding
          } else if (currentScrollY < lastScrollY - 10) {
            // Scrolling up with some threshold - show navbar immediately
            setIsVisible(true);
          }
          
          setLastScrollY(currentScrollY);
        }
      }, 10); // Small delay for smoother experience
      
      setScrollTimeout(newTimeout);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [lastScrollY, scrollTimeout]);

  const fetchHeroContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero`);
      if (response.ok) {
        const data = await response.json();
        setHeroContent(data);
      }
    } catch (error) {
      // Error fetching hero content
    }
  };


  // Dynamic styling based on scroll position for better UX
  const getNavbarBackground = () => {
    if (isScrolled) {
      return 'bg-background/90 backdrop-blur-xl shadow-2xl shadow-primary/5 border-primary/10';
    }
    return 'bg-background/80 backdrop-blur-lg border-transparent';
  };

  const getNavbarTextColor = () => {
    return 'text-foreground';
  };

  const getNavbarBorder = () => {
    return 'border-border';
  };

  const getHoverColor = () => {
    return 'hover:text-primary hover:scale-105 hover:-translate-y-0.5';
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full ${getNavbarBackground()} border-b ${getNavbarBorder()} z-50 ${
      isScrolled ? 'py-1 md:py-2' : 'py-2 md:py-3'
    } ${isVisible ? 'translate-y-0' : '-translate-y-full'} transition-all duration-700 ease-in-out`}>
      <div className="container mx-auto px-3 md:px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className={`text-lg md:text-xl lg:text-2xl font-bold ${getNavbarTextColor()} transition-all duration-300 truncate hover:scale-105 cursor-pointer`}
              onClick={() => scrollToSection('home')}>
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-300% animate-gradient-x">
              {heroContent.name.length > 12 ? 'AAYUSH GUPTA' : heroContent.name}
            </span>
          </h1>
        </div>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <button
            onClick={() => scrollToSection('home')}
            className={`${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/25`}
          >
            HOME
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className={`${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/25`}
          >
            ABOUT
          </button>
          <button
            onClick={() => scrollToSection('skills')}
            className={`${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/25`}
          >
            SKILLS
          </button>
          <button
            onClick={() => scrollToSection('experience')}
            className={`${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/25`}
          >
            EXPERIENCE
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className={`${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/25`}
          >
            PROJECTS
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className={`${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/25`}
          >
            CONTACT
          </button>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hover:bg-primary/10 hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 rounded-full">
            {darkMode ? <Sun className={`h-5 w-5 ${getNavbarTextColor()} group-hover:rotate-180 transition-transform duration-300`} /> : <Moon className={`h-5 w-5 ${getNavbarTextColor()} group-hover:rotate-180 transition-transform duration-300`} />}
          </Button>
        </nav>

        <div className="md:hidden flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="hover:bg-primary/10 hover:scale-110 transition-all duration-300 p-2 rounded-full">
            {darkMode ? <Sun className={`h-4 w-4 ${getNavbarTextColor()} transition-transform duration-300`} /> : <Moon className={`h-4 w-4 ${getNavbarTextColor()} transition-transform duration-300`} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hover:bg-primary/10 hover:scale-110 transition-all duration-300 p-2 rounded-full"
          >
            {isMenuOpen ? <X className={`h-5 w-5 ${getNavbarTextColor()} transition-transform duration-300 rotate-90`} /> : <Menu className={`h-5 w-5 ${getNavbarTextColor()} transition-transform duration-300`} />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className={`md:hidden ${getNavbarBackground()} border-t ${getNavbarBorder()} transition-all duration-300 animate-fade-in-up`}>
          <nav className="container mx-auto px-3 py-4 flex flex-col space-y-3">
            <button
              onClick={() => scrollToSection('home')}
              className={`text-left ${getNavbarTextColor()} hover:text-primary hover:bg-primary/10 transition-all duration-300 py-3 px-4 rounded-lg font-semibold text-sm border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 transform hover:translate-x-2`}
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`text-left ${getNavbarTextColor()} hover:text-primary hover:bg-primary/10 transition-all duration-300 py-3 px-4 rounded-lg font-semibold text-sm border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 transform hover:translate-x-2`}
            >
              ABOUT
            </button>
            <button
              onClick={() => scrollToSection('skills')}
              className={`text-left ${getNavbarTextColor()} hover:text-primary hover:bg-primary/10 transition-all duration-300 py-3 px-4 rounded-lg font-semibold text-sm border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 transform hover:translate-x-2`}
            >
              SKILLS
            </button>
            <button
              onClick={() => scrollToSection('experience')}
              className={`text-left ${getNavbarTextColor()} hover:text-primary hover:bg-primary/10 transition-all duration-300 py-3 px-4 rounded-lg font-semibold text-sm border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 transform hover:translate-x-2`}
            >
              EXPERIENCE
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className={`text-left ${getNavbarTextColor()} hover:text-primary hover:bg-primary/10 transition-all duration-300 py-3 px-4 rounded-lg font-semibold text-sm border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10 transform hover:translate-x-2`}
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`text-left ${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 py-1 text-sm md:text-base`}
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
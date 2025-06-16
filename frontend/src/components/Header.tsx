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
      console.error('Error fetching hero content:', error);
    }
  };


  // Dynamic styling based on scroll position for better UX
  const getNavbarBackground = () => {
    if (isScrolled) {
      return 'bg-background/98 backdrop-blur-lg shadow-lg';
    }
    return 'bg-background/95 backdrop-blur-md';
  };

  const getNavbarTextColor = () => {
    return 'text-foreground';
  };

  const getNavbarBorder = () => {
    return 'border-border';
  };

  const getHoverColor = () => {
    return 'hover:text-primary';
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
    } ${isVisible ? 'translate-y-0' : '-translate-y-full'} transition-all duration-500 ease-in-out`}>
      <div className="container mx-auto px-3 md:px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className={`text-lg md:text-xl lg:text-2xl font-bold ${getNavbarTextColor()} transition-colors duration-300 truncate`}>
            {heroContent.name.length > 12 ? 'AAYUSH GUPTA' : heroContent.name}
          </h1>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => scrollToSection('home')}
            className={`${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 font-semibold`}
          >
            HOME
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className={`${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 font-semibold`}
          >
            ABOUT
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className={`${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 font-semibold`}
          >
            PROJECTS
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className={`${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 font-semibold`}
          >
            CONTACT
          </button>
          <button
            onClick={() => scrollToSection('fun-centre')}
            className={`${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 font-semibold`}
          >
            FUN CENTRE
          </button>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hover:bg-muted transition-all duration-300">
            {darkMode ? <Sun className={`h-5 w-5 ${getNavbarTextColor()}`} /> : <Moon className={`h-5 w-5 ${getNavbarTextColor()}`} />}
          </Button>
        </nav>

        <div className="md:hidden flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="hover:bg-muted p-2">
            {darkMode ? <Sun className={`h-4 w-4 ${getNavbarTextColor()}`} /> : <Moon className={`h-4 w-4 ${getNavbarTextColor()}`} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hover:bg-muted p-2"
          >
            {isMenuOpen ? <X className={`h-5 w-5 ${getNavbarTextColor()}`} /> : <Menu className={`h-5 w-5 ${getNavbarTextColor()}`} />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className={`md:hidden ${getNavbarBackground()} border-t ${getNavbarBorder()} transition-all duration-300`}>
          <nav className="container mx-auto px-3 md:px-4 py-3 md:py-4 flex flex-col space-y-2 md:space-y-3">
            <button
              onClick={() => scrollToSection('home')}
              className={`text-left ${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 py-1 text-sm md:text-base`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`text-left ${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 py-1 text-sm md:text-base`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className={`text-left ${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 py-1 text-sm md:text-base`}
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`text-left ${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 py-1 text-sm md:text-base`}
            >
              Contact
            </button>
            <button
              onClick={() => scrollToSection('fun-centre')}
              className={`text-left ${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300 py-1 text-sm md:text-base`}
            >
              Fun Centre
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
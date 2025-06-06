import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Moon, Sun, Menu, X } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);


  const getClockColor = () => {
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const timeDecimal = hour + minutes / 60;
    
    if (timeDecimal >= 5 && timeDecimal < 6) {
      // Pre-dawn - inverse of dark blue (warm orange)
      return 'text-orange-400';
    }
    if (timeDecimal >= 6 && timeDecimal < 7) {
      // Dawn - inverse of orange/pink (cool blue)
      return 'text-cyan-300';
    }
    if (timeDecimal >= 7 && timeDecimal < 9) {
      // Early morning - inverse of golden (deep blue)
      return 'text-blue-900';
    }
    if (timeDecimal >= 9 && timeDecimal < 12) {
      // Morning - inverse of light blue (warm orange)
      return 'text-orange-600';
    }
    if (timeDecimal >= 12 && timeDecimal < 15) {
      // Midday - inverse of bright blue (warm red)
      return 'text-red-600';
    }
    if (timeDecimal >= 15 && timeDecimal < 17) {
      // Afternoon - inverse of softer blue (warm orange)
      return 'text-orange-600';
    }
    if (timeDecimal >= 17 && timeDecimal < 18) {
      // Late afternoon - inverse of warm blue (yellow)
      return 'text-yellow-400';
    }
    if (timeDecimal >= 18 && timeDecimal < 19) {
      // Sunset - inverse of orange/red (cool cyan)
      return 'text-cyan-400';
    }
    if (timeDecimal >= 19 && timeDecimal < 20) {
      // Dusk - inverse of purple/pink (lime green)
      return 'text-lime-400';
    }
    if (timeDecimal >= 20 && timeDecimal < 22) {
      // Early night - inverse of deep purple (light yellow)
      return 'text-yellow-300';
    }
    // Night - inverse of very dark blue/black (bright white/yellow)
    return 'text-yellow-200';
  };

  const getNavbarBackground = () => {
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const timeDecimal = hour + minutes / 60;
    
    if (timeDecimal >= 5 && timeDecimal < 6) {
      // Pre-dawn - very dark blue
      return 'bg-gradient-to-r from-slate-900/95 via-blue-950/95 to-slate-900/95';
    }
    if (timeDecimal >= 6 && timeDecimal < 7) {
      // Dawn - deep orange/pink
      return 'bg-gradient-to-r from-orange-900/90 via-pink-900/90 to-orange-900/90';
    }
    if (timeDecimal >= 7 && timeDecimal < 9) {
      // Early morning - golden
      return 'bg-gradient-to-r from-amber-800/85 via-yellow-700/85 to-amber-800/85';
    }
    if (timeDecimal >= 9 && timeDecimal < 12) {
      // Morning - light blue
      return 'bg-gradient-to-r from-sky-400/80 via-blue-400/80 to-sky-400/80';
    }
    if (timeDecimal >= 12 && timeDecimal < 15) {
      // Midday - bright blue
      return 'bg-gradient-to-r from-sky-300/75 via-blue-300/75 to-sky-300/75';
    }
    if (timeDecimal >= 15 && timeDecimal < 17) {
      // Afternoon - softer blue
      return 'bg-gradient-to-r from-sky-400/80 via-blue-400/80 to-sky-400/80';
    }
    if (timeDecimal >= 17 && timeDecimal < 18) {
      // Late afternoon - warm blue
      return 'bg-gradient-to-r from-blue-500/85 via-indigo-500/85 to-blue-500/85';
    }
    if (timeDecimal >= 18 && timeDecimal < 19) {
      // Sunset - orange/red
      return 'bg-gradient-to-r from-orange-600/90 via-red-500/90 to-orange-600/90';
    }
    if (timeDecimal >= 19 && timeDecimal < 20) {
      // Dusk - purple/pink
      return 'bg-gradient-to-r from-purple-700/90 via-pink-600/90 to-purple-700/90';
    }
    if (timeDecimal >= 20 && timeDecimal < 22) {
      // Early night - deep purple
      return 'bg-gradient-to-r from-purple-900/95 via-indigo-900/95 to-purple-900/95';
    }
    // Night - very dark blue/black
    return 'bg-gradient-to-r from-slate-950/95 via-blue-950/95 to-slate-950/95';
  };

  const getNavbarTextColor = () => {
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const timeDecimal = hour + minutes / 60;
    
    if (timeDecimal >= 5 && timeDecimal < 7) {
      // Pre-dawn/Dawn - light text for dark backgrounds
      return 'text-gray-100';
    }
    if (timeDecimal >= 7 && timeDecimal < 9) {
      // Early morning - dark text for golden background
      return 'text-gray-900';
    }
    if (timeDecimal >= 9 && timeDecimal < 17) {
      // Day hours - dark text for light blue backgrounds
      return 'text-gray-900';
    }
    if (timeDecimal >= 17 && timeDecimal < 19) {
      // Sunset - light text for orange/red
      return 'text-gray-100';
    }
    if (timeDecimal >= 19 && timeDecimal < 22) {
      // Dusk/Evening - light text for purple
      return 'text-gray-100';
    }
    // Night - light text
    return 'text-gray-100';
  };

  const getNavbarBorder = () => {
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const timeDecimal = hour + minutes / 60;
    
    if (timeDecimal >= 5 && timeDecimal < 6) {
      return 'border-slate-700';
    }
    if (timeDecimal >= 6 && timeDecimal < 7) {
      return 'border-orange-600';
    }
    if (timeDecimal >= 7 && timeDecimal < 9) {
      return 'border-amber-600';
    }
    if (timeDecimal >= 9 && timeDecimal < 12) {
      return 'border-sky-500';
    }
    if (timeDecimal >= 12 && timeDecimal < 15) {
      return 'border-sky-400';
    }
    if (timeDecimal >= 15 && timeDecimal < 17) {
      return 'border-sky-500';
    }
    if (timeDecimal >= 17 && timeDecimal < 18) {
      return 'border-blue-600';
    }
    if (timeDecimal >= 18 && timeDecimal < 19) {
      return 'border-orange-500';
    }
    if (timeDecimal >= 19 && timeDecimal < 20) {
      return 'border-purple-500';
    }
    if (timeDecimal >= 20 && timeDecimal < 22) {
      return 'border-purple-700';
    }
    return 'border-slate-700';
  };

  const getHoverColor = () => {
    const hour = time.getHours();
    const minutes = time.getMinutes();
    const timeDecimal = hour + minutes / 60;
    
    if (timeDecimal >= 7 && timeDecimal < 17) {
      // Day hours - use darker colors for hover
      return 'hover:text-gray-700';
    }
    // Night hours - use lighter colors for hover
    return 'hover:text-gray-300';
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full ${getNavbarBackground()} backdrop-blur-md border-b ${getNavbarBorder()} z-50 transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className={`text-2xl font-bold ${getNavbarTextColor()} transition-colors duration-1000`}>AAYUSH GUPTA</h1>
          <div className={`hidden md:block text-sm font-mono font-bold ${getClockColor()}`}>
            {time.toLocaleTimeString()}
          </div>
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
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className={`${getNavbarBorder()} hover:bg-white/10 transition-all duration-300`}>
            {darkMode ? <Sun className={`h-5 w-5 ${getNavbarTextColor()}`} /> : <Moon className={`h-5 w-5 ${getNavbarTextColor()}`} />}
          </Button>
        </nav>

        <div className="md:hidden flex items-center space-x-2">
          <div className={`text-xs font-mono ${getClockColor()}`}>
            {time.toLocaleTimeString()}
          </div>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hover:bg-white/10">
            {darkMode ? <Sun className={`h-4 w-4 ${getNavbarTextColor()}`} /> : <Moon className={`h-4 w-4 ${getNavbarTextColor()}`} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hover:bg-white/10"
          >
            {isMenuOpen ? <X className={`h-5 w-5 ${getNavbarTextColor()}`} /> : <Menu className={`h-5 w-5 ${getNavbarTextColor()}`} />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className={`md:hidden ${getNavbarBackground()} border-t ${getNavbarBorder()} transition-all duration-1000`}>
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            <button
              onClick={() => scrollToSection('home')}
              className={`text-left ${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`text-left ${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className={`text-left ${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300`}
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`text-left ${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300`}
            >
              Contact
            </button>
            <button
              onClick={() => scrollToSection('fun-centre')}
              className={`text-left ${getNavbarTextColor()} ${getHoverColor()} transition-all duration-300`}
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
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';
import { preCacheData, warmCache } from './lib/cache';
import { API_BASE_URL } from './config/api';
import { useSectionVisibility } from './hooks/useSectionVisibility';

// Main Portfolio Component with Dark Nebula theme
const Portfolio: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  // Track section visibility for dynamic SEO updates
  useSectionVisibility();
  
  // Scroll progress indicator
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);
  
  return (
    <div className="min-h-screen bg-background text-foreground nebula-gradient star-field relative">
      {/* Premium Scroll Progress Indicator */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-primary z-[100] transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Education />
        <Projects />
        <Contact />
      </main>
      <footer className="bg-card/20 py-8 text-center text-muted-foreground border-t border-border relative z-10">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Aayush Gupta. Built with React, TypeScript, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
};

// Protected Admin Route Component
const ProtectedAdminRoute: React.FC = () => {
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setAdminToken(savedToken);
    }
  }, []);

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
  };

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
  };

  if (adminToken) {
    return <AdminPanel token={adminToken} onLogout={handleAdminLogout} />;
  }

  return <AdminLogin onLogin={handleAdminLogin} onClose={() => window.history.back()} />;
};

function App() {
  const [darkMode, setDarkMode] = useState(false); // Default to light mode

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check saved preference or system preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Admin panel keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'a') {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Aggressive cache warming for production to handle cold starts
    if (process.env.NODE_ENV === 'production') {
      warmCache(API_BASE_URL);
    } else {
      // Simple pre-cache for development
      preCacheData(API_BASE_URL).then(() => {
        // Pre-cache completed successfully
      }).catch(() => {
        // Pre-cache failed
      });
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Portfolio darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} 
        />
        <Route 
          path="/admin" 
          element={<ProtectedAdminRoute />} 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;

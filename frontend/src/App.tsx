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
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import Contact from './components/Contact';
import FunCentre from './components/FunCentre';
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';
import { preCacheData, warmCache } from './lib/cache';
import { API_BASE_URL } from './config/api';
import { useSectionVisibility } from './hooks/useSectionVisibility';

// Main Portfolio Component with Dark Nebula theme
const Portfolio: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  // Track section visibility for dynamic SEO updates
  useSectionVisibility();
  
  return (
    <div className="min-h-screen bg-background text-foreground nebula-gradient star-field relative">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Education />
        <Projects />
        <Testimonials />
        <Blog />
        <Contact />
        <FunCentre />
      </main>
      <footer className="bg-card/20 py-8 text-center text-muted-foreground border-t border-glow relative z-10">
        <div className="container mx-auto px-4">
          <p className="glow-text-primary">&copy; {new Date().getFullYear()} Aayush Gupta. Built with React, TypeScript, and Tailwind CSS.</p>
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
        console.log('Pre-cache completed successfully');
      }).catch(console.error);
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

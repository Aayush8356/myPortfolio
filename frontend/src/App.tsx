import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import FunCentre from './components/FunCentre';
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';
import { preCacheData } from './lib/cache';
import { API_BASE_URL } from './config/api';

// Main Portfolio Component with Dark Nebula theme
const Portfolio: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground nebula-gradient star-field relative">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
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
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode for Dark Nebula theme

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark mode for Dark Nebula theme
    if (savedTheme === 'dark' || savedTheme === 'light') {
      const isDark = savedTheme === 'dark';
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    } else {
      // No saved preference - default to dark mode for Dark Nebula
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }

    // Admin panel keyboard shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'a') {
        e.preventDefault();
        window.location.href = '/admin';
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Pre-cache data for faster loading
    const timer = setTimeout(() => {
      preCacheData(API_BASE_URL);
    }, 1000); // Pre-cache after 1 second to not block initial render
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
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

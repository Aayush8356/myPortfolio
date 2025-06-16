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
import WeatherWidget from './components/WeatherWidget';
import { WeatherThemeProvider } from './contexts/WeatherThemeContext';
import { preCacheData } from './lib/cache';
import { API_BASE_URL } from './config/api';

// Main Portfolio Component
const Portfolio: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-1000">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Weather Widget - positioned fixed in top right */}
      <div className="fixed top-20 right-4 z-40 hidden md:block">
        <WeatherWidget />
      </div>
      
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
        <FunCentre />
      </main>
      
      <footer className="bg-secondary/5 py-8 text-center text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Aayush Gupta. Built with React, TypeScript, and Tailwind CSS.</p>
          
          {/* Mobile Weather Widget */}
          <div className="mt-4 md:hidden flex justify-center">
            <WeatherWidget />
          </div>
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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
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
    <WeatherThemeProvider>
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
    </WeatherThemeProvider>
  );
}

export default App;

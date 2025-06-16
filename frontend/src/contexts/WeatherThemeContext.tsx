import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import weatherService, { WeatherData, WeatherTheme } from '../services/weatherService';

interface WeatherThemeContextType {
  weatherData: WeatherData | null;
  currentTheme: WeatherTheme;
  isLoading: boolean;
  error: string | null;
  refreshWeather: () => Promise<void>;
}

const WeatherThemeContext = createContext<WeatherThemeContextType | undefined>(undefined);

interface WeatherThemeProviderProps {
  children: ReactNode;
}

export const WeatherThemeProvider: React.FC<WeatherThemeProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentTheme, setCurrentTheme] = useState<WeatherTheme>(
    weatherService.getThemeForWeather('default')
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshWeather = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await weatherService.getCurrentWeather();
      
      if (data) {
        setWeatherData(data);
        const theme = weatherService.getThemeForWeather(data.condition);
        setCurrentTheme(theme);
        applyThemeToDocument(theme);
      } else {
        // Fallback to default theme
        const defaultTheme = weatherService.getThemeForWeather('default');
        setCurrentTheme(defaultTheme);
        applyThemeToDocument(defaultTheme);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Unable to fetch weather data');
      
      // Fallback to default theme
      const defaultTheme = weatherService.getThemeForWeather('default');
      setCurrentTheme(defaultTheme);
      applyThemeToDocument(defaultTheme);
    } finally {
      setIsLoading(false);
    }
  };

  const applyThemeToDocument = (theme: WeatherTheme) => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-foreground', theme.colors.foreground);
    root.style.setProperty('--color-muted', theme.colors.muted);
    root.style.setProperty('--color-card', theme.colors.card);
    root.style.setProperty('--color-border', theme.colors.border);
    
    // Apply gradient colors
    root.style.setProperty('--gradient-from', theme.colors.gradient.from);
    if (theme.colors.gradient.via) {
      root.style.setProperty('--gradient-via', theme.colors.gradient.via);
    }
    root.style.setProperty('--gradient-to', theme.colors.gradient.to);
    
    // Apply header gradient
    root.style.setProperty('--header-gradient-from', theme.colors.headerGradient.from);
    root.style.setProperty('--header-gradient-to', theme.colors.headerGradient.to);
    
    // Update body background with gradient
    document.body.style.background = theme.colors.gradient.via 
      ? `linear-gradient(135deg, ${theme.colors.gradient.from} 0%, ${theme.colors.gradient.via} 50%, ${theme.colors.gradient.to} 100%)`
      : `linear-gradient(135deg, ${theme.colors.gradient.from} 0%, ${theme.colors.gradient.to} 100%)`;
    
    // Add transition for smooth theme changes
    document.body.style.transition = 'background 1s ease-in-out';
  };

  useEffect(() => {
    // Initial weather fetch
    refreshWeather();
    
    // Refresh weather every 30 minutes
    const interval = setInterval(refreshWeather, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const value: WeatherThemeContextType = {
    weatherData,
    currentTheme,
    isLoading,
    error,
    refreshWeather
  };

  return (
    <WeatherThemeContext.Provider value={value}>
      {children}
    </WeatherThemeContext.Provider>
  );
};

export const useWeatherTheme = (): WeatherThemeContextType => {
  const context = useContext(WeatherThemeContext);
  if (context === undefined) {
    throw new Error('useWeatherTheme must be used within a WeatherThemeProvider');
  }
  return context;
};